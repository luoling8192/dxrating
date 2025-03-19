import type { ILuoXueResponse } from './b50/datasource'
import { env } from 'cloudflare:workers'
import { error, json, Router, withParams } from 'itty-router'
import b50 from './b50'
import plates from './plates'

// Initialize router
const app = Router()

// Fetch player data from LuoXue API
async function getLuoxueData(friendCode: string): Promise<string | ILuoXueResponse> {
  try {
    const res = await fetch(
      `https://maimai.lxns.net/api/v0/maimai/player/${friendCode}/bests`,
      {
        method: 'GET',
        headers: {
          Authorization: env.LUOXUE_API_KEY,
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
function getPlateId(rating: number): string {
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
function generateRatingSvg(rating: number, plate: string): string {
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

// Route handlers
app.get('/api/genImage/:friendCode', withParams, async ({ friendCode }) => {
  const data = await getLuoxueData(friendCode)
  if (typeof data === 'string')
    return error(400, { status: 'error', message: data })

  const rating = b50(data)
  const plateId = getPlateId(rating) as keyof typeof plates
  const plate = plates[plateId]
  const svg = generateRatingSvg(rating, plate)

  return new Response(svg, {
    headers: { 'Content-Type': 'image/svg+xml' },
  })
})

app.get('/api/getRating/:friendCode', withParams, async ({ friendCode }) => {
  const data = await getLuoxueData(friendCode)
  if (typeof data === 'string')
    return error(400, { status: 'error', message: data })

  return json({ status: 'success', data: b50(data) })
})

app.get('/', () => {
  return new Response(`
<html lang="zh_CN">
<head><title>DX-Rating 生成器</title></head>
<body>
<h1>欢迎使用洛灵酱的 DX-Rating 生成器！</h1>
<b>注意，本生成器基于水鱼查分器 <a href="https://www.diving-fish.com/maimaidx/prober/" target="_blank">Diving-Fish</a>，使用前请先注册账号并上传数据。</b>
<p>获取 Rating 分数：<a href="https://dxrating.luoling.moe/api/getRating/689056381852418" target="_blank">https://dxrating.luoling.moe/api/getRating/689056381852418</a></p>
<p>生成 Rating 图片（可以嵌入到 Markdown 中使用）：<a href="https://dxrating.luoling.moe/api/genImage/689056381852418" target="_blank">https://dxrating.luoling.moe/api/genImage/689056381852418</a></p>
<p>使用前替换掉用户名就好啦～</p>
</body>
</html>
`, { headers: { 'Content-Type': 'text/html;charset=UTF-8' } })
})

export default app
