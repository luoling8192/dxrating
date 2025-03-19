import type { Env } from '.'
import type { ILuoXueResponse } from './b50/datasource'
import { env } from 'cloudflare:workers'

// Fetch player data from LuoXue API
export async function getLuoxueData(friendCode: string): Promise<string | ILuoXueResponse> {
  try {
    const res = await fetch(
      `https://maimai.lxns.net/api/v0/maimai/player/${friendCode}/bests`,
      {
        method: 'GET',
        headers: {
          Authorization: (env as Env).LUOXUE_API_KEY,
        },
      },
    )

    const data: any = await res.json()
    return res.status === 200 ? data : data.message
  }
  catch (e) {
    return (e as Error).message
  }
}

// Get plate ID based on rating thresholds
export function getPlateId(rating: number): string {
  const levels = [1000, 2000, 4000, 7000, 10000, 12000, 13000, 14000, 14500, 15000]

  if (rating < levels[0])
    return '01'
  if (rating >= levels[9])
    return '11'

  const plateIndex = levels.findIndex((threshold, i) =>
    rating >= threshold && rating < levels[i + 1],
  )

  return plateIndex >= 0
    ? (plateIndex + 2).toString().padStart(2, '0')
    : '00'
}

// Generate SVG image with rating and plate
export function generateRatingSvg(rating: number, plate: string): string {
  const digits = rating.toString()
  const startX = 5 - digits.length - 1

  return `<svg xmlns="http://www.w3.org/2000/svg" width="100px" height="20px">
    <image href="${plate}" x="0" y="0" height="1.2em"/>
    ${digits.split('').map((char, i) => `
      <text
        x="${4.9 + (startX + i + 1) * 0.8}em"
        y="1.45em"
        font-family="Monaco, 'JetBrains Mono', Monospaced, monospace"
        font-size="0.6em"
        fill="#FCD41B">
        ${char}
      </text>`).join('')}
  </svg>`
}
