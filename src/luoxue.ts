import type { Env } from '.'
import type { ILuoXueResponse } from './types/luoxue'
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
