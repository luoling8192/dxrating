import { divingFishB50, luoxueB50 } from './b50'
import { generateRatingSvg, getPlateId } from './common'
import { getDivingFishData } from './divingfish'
import { getLuoxueData } from './luoxue'
import plates from './plates'
import Root from './root'

// Interface for rating data providers
interface RatingProvider {
  getData: (friendCode: string) => Promise<any>
  getRating: (data: any) => number
}

// Base class for handling rating-related responses
abstract class RatingHandler {
  constructor(protected provider: RatingProvider) {}

  protected validateFriendCode(friendCode: string): Response | null {
    if (!friendCode)
      return new Response('Missing friend code', { status: 400 })
    return null
  }

  protected handleError(message: string): Response {
    return new Response(JSON.stringify({ status: 'error', message }), { status: 400 })
  }

  protected async fetchRating(friendCode: string): Promise<number | string> {
    const data = await this.provider.getData(friendCode)
    if (typeof data === 'string')
      return data
    return this.provider.getRating(data)
  }
}

// Handler for generating rating SVG images
class ImageGenerationHandler extends RatingHandler {
  async handle(friendCode: string): Promise<Response> {
    const validationError = this.validateFriendCode(friendCode)
    if (validationError)
      return validationError

    const rating = await this.fetchRating(friendCode)
    if (typeof rating === 'string')
      return this.handleError(rating)

    const plateId = getPlateId(rating) as keyof typeof plates
    const plate = plates[plateId]
    const svg = generateRatingSvg(rating, plate)

    return new Response(svg, {
      headers: { 'Content-Type': 'image/svg+xml' },
    })
  }
}

// Handler for rating lookup responses
class RatingLookupHandler extends RatingHandler {
  async handle(friendCode: string): Promise<Response> {
    const validationError = this.validateFriendCode(friendCode)
    if (validationError)
      return validationError

    const rating = await this.fetchRating(friendCode)
    if (typeof rating === 'string')
      return this.handleError(rating)

    return new Response(JSON.stringify({ status: 'success', data: rating }), {
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

// Handles root path response
function handleRoot(): Response {
  return new Response(Root(), { headers: { 'Content-Type': 'text/html;charset=UTF-8' } })
}

// Helper functions for request handling
function handleImageGeneration(
  friendCode: string,
  getData: (friendCode: string) => Promise<any>,
  getRating: (data: any) => number,
): Promise<Response> {
  const handler = new ImageGenerationHandler({ getData, getRating })
  return handler.handle(friendCode)
}

function handleRatingLookup(
  friendCode: string,
  getData: (friendCode: string) => Promise<any>,
  getRating: (data: any) => number,
): Promise<Response> {
  const handler = new RatingLookupHandler({ getData, getRating })
  return handler.handle(friendCode)
}

export async function handleRequest(request: Request): Promise<Response> {
  const url = new URL(request.url)
  const path = url.pathname
  const friendCode = path.split('/').pop()

  // Route requests to appropriate handlers
  if (path.startsWith('/api/genImage/'))
    return handleImageGeneration(friendCode!, getDivingFishData, divingFishB50)

  if (path.startsWith('/api/getRating/'))
    return handleRatingLookup(friendCode!, getDivingFishData, divingFishB50)

  if (path.startsWith('/api/luoxue/genImage/'))
    return handleImageGeneration(friendCode!, getLuoxueData, luoxueB50)

  if (path.startsWith('/api/luoxue/getRating/'))
    return handleRatingLookup(friendCode!, getLuoxueData, luoxueB50)

  if (path === '/')
    return handleRoot()

  // Handle 404
  return new Response(JSON.stringify({ status: 'error', message: 'Not Found' }), { status: 404 })
}
