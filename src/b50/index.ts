// https://github.com/ekkusu-3800mhz/maimai-b50-simulator
// https://github.com/ekkusu-3800mhz/maimai-b50-simulator/pull/1

import type { DivingFishResponse } from '../types/divingfish'
import type { ILuoXueResponse } from '../types/luoxue'
import { sumRa, updateRa } from './achievement'

export function divingFishB50(data: DivingFishResponse, calc: boolean = true) {
  if (calc) {
    // Get top 35 standard chart scores sorted by rating
    const b35List = updateRa(data.charts.sd)
      .sort((a, b) => b.ra - a.ra)
      .slice(0, 35)

    // Get top 15 DX chart scores sorted by rating
    const b15List = updateRa(data.charts.dx)
      .sort((a, b) => b.ra - a.ra)
      .slice(0, 15)

    // Calculate total rating by summing top scores
    const b35: number = sumRa(b35List)
    const b15: number = sumRa(b15List)

    // Return total rating (B35 + B15)
    return b35 + b15
  }

  return data.rating
}

export function luoxueB50(response: ILuoXueResponse) {
  return response.data.dx_total + response.data.standard_total
}
