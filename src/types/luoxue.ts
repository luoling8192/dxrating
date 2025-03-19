// LuoXue API interfaces
export interface ILuoXueMusicChart {
  id: number
  song_name: string
  level: string
  level_index: number
  achievements: number
  fc: string
  fs: string
  dx_score: number
  dx_rating: number
  rate: string
  type: string
  upload_time: string
}

export interface ILuoXueResponse {
  success: boolean
  code: number
  data: {
    standard_total: number
    dx_total: number
    standard: Array<ILuoXueMusicChart>
    dx?: Array<ILuoXueMusicChart>
  }
}
