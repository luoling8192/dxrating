// https://github.com/ekkusu-3800mhz/maimai-b50-simulator
// https://github.com/ekkusu-3800mhz/maimai-b50-simulator/pull/1

import type { ILuoXueResponse, IMusicChart } from './datasource'
import { sumRa, updateRa } from './functions'

export default (data: ILuoXueResponse) => {
  // Convert standard charts to IMusicChart format and calculate top 35
  const b35List: Array<IMusicChart> = updateRa(data.data.standard)

  // Convert DX charts to IMusicChart format and calculate top 15 if available
  const b15List: Array<IMusicChart> = data.data.dx ? updateRa(data.data.dx) : []

  // Calculate rating by summing top scores
  const b35: number = sumRa(b35List)
  const b15: number = sumRa(b15List)

  // Return total rating (B35 + B15)
  return b35 + b15
}
