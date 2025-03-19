import { generateRatingSvg, getLuoxueData, getPlateId } from './luoxue'
import b50 from './b50'
import plates from './plates'

export async function handleRequest(request: Request): Promise<Response> {
  const url = new URL(request.url)
  const path = url.pathname

  // Handle image generation
  if (path.startsWith('/api/genImage/')) {
    const friendCode = path.split('/').pop()
    if (!friendCode)
      return new Response('Missing friend code', { status: 400 })

    const data = await getLuoxueData(friendCode)
    if (typeof data === 'string')
      return new Response(JSON.stringify({ status: 'error', message: data }), { status: 400 })

    const rating = b50(data)
    const plateId = getPlateId(rating) as keyof typeof plates
    const plate = plates[plateId]
    const svg = generateRatingSvg(rating, plate)

    return new Response(svg, {
      headers: { 'Content-Type': 'image/svg+xml' },
    })
  }

  // Handle rating lookup
  if (path.startsWith('/api/getRating/')) {
    const friendCode = path.split('/').pop()
    if (!friendCode)
      return new Response('Missing friend code', { status: 400 })

    const data = await getLuoxueData(friendCode)
    if (typeof data === 'string')
      return new Response(JSON.stringify({ status: 'error', message: data }), { status: 400 })

    return new Response(JSON.stringify({ status: 'success', data: b50(data) }), {
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // Handle root path
  if (path === '/') {
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
  }

  // Handle 404
  return new Response(JSON.stringify({ status: 'error', message: 'Not Found' }), { status: 404 })
}
