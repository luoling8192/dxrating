export default function Root() {
  return (`
    <html lang="zh_CN">
      <head>
        <title>DX-Rating 生成器</title>
      </head>
      <body>
        <h1>欢迎使用洛灵酱的 DX-Rating 生成器！</h1>
        <b>
          本生成器支持以下查分器:
          <ul>
            <li>
              <a href="https://www.diving-fish.com/maimaidx/prober/" target="_blank">水鱼查分器 (Diving-Fish)</a>
              - 使用前请先注册账号并上传数据
            </li>
            <li>
              <a href="https://maimai.lxns.net/" target="_blank">落雪查分器</a>
              - 使用前请先注册账号并上传数据
            </li>
          </ul>
        </b>
        <h2>水鱼查分器 API</h2>
        <p>
          获取 Rating 分数：<a href="https://dxrating.luoling.moe/api/getRating/689056381852418" target="_blank"
            >https://dxrating.luoling.moe/api/getRating/689056381852418</a
          >
        </p>
        <p>
          生成 Rating 图片：<a
            href="https://dxrating.luoling.moe/api/genImage/689056381852418"
            target="_blank"
            >https://dxrating.luoling.moe/api/genImage/689056381852418</a
          >
        </p>
        <h2>落雪查分器 API</h2>
        <p>
          获取 Rating 分数：<a href="https://dxrating.luoling.moe/api/luoxue/getRating/689056381852418" target="_blank"
            >https://dxrating.luoling.moe/api/luoxue/getRating/689056381852418</a
          >
        </p>
        <p>
          生成 Rating 图片：<a
            href="https://dxrating.luoling.moe/api/luoxue/genImage/689056381852418"
            target="_blank"
            >https://dxrating.luoling.moe/api/luoxue/genImage/689056381852418</a
          >
        </p>
        <p>使用前替换掉用户名就好啦～</p>
      </body>
    </html>
  `)
}
