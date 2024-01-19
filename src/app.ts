import { Router, withParams, json, error } from 'itty-router';
import b50 from './b50';
import { IResponse } from './b50/datasource';
import plates from './plates';

const app = Router();

const getPlayerData = async (username: string): Promise<string | IResponse> => {
	try {
		const res = await fetch(
			'https://www.diving-fish.com/api/maimaidxprober/query/player', {
				method: 'POST',
				body: JSON.stringify({
					b50: true,
					username: username
				}),
				headers: {
					'content-type': 'application/json'
				}
			});

		const data: any = await res.json();

		if (res.status !== 200) {
			return data['message'];
		}

		return data;
	} catch (e) {
		return (e as Error).message;
	}
};

const getPlateId = (rating: number) => {
	const levels = [
		1000,
		2000,
		4000,
		7000,
		10000,
		12000,
		13000,
		14000,
		14500,
		15000];
	if (rating < levels[0]) return '01';
	if (rating >= levels[9]) return '11';
	for (let i = 0; i < 9; i++) {
		if (rating >= levels[i] && rating < levels[i + 1])
			return (i + 2).toString().padStart(2, '0');
	}

	return '00'; // Never read
};

app.get('/api/genImage/:username', withParams, async ({ username }) => {
	const data = await getPlayerData(username);
	if (typeof data === 'string') {
		return error(400, { status: 'error', message: data });
	}

	const rating = b50(data);

	// @ts-ignore
	const plate = plates[getPlateId(rating)];

	let i = 5 - rating.toString().length - 1;

	let svg =
		`<svg xmlns="http://www.w3.org/2000/svg">
     	<image href="${plate}" x="0" y="0" height="1.2em"/>
    	 ${Array.from(rating.toString()).map((char) => {
			i++;
			return `<text
											x="${4.9 + i * 0.8}em"
											y="1.45em"
											font-family="Monaco, 'JetBrains Mono', Monospaced, monospace"
											font-size="0.6em"
											fill="#FCD41B">
									${char}
								</text>`;
		})}
    </svg>`;

	return new Response(svg, {
		headers: { 'Content-Type': 'image/svg+xml' }
	});
});

app.get('/api/getRating/:username', withParams, async ({ username }) => {
	const data = await getPlayerData(username);
	if (typeof data === 'string') {
		return error(400, { status: 'error', message: data });
	}

	return json({ status: 'success', data: b50(data) });
});

app.get('/', () => {
	return new Response(`
<html lang="zh_CN">
<head><title>DX-Rating 生成器</title></head>
<body>
<h1>欢迎使用洛灵酱的 DX-Rating 生成器！</h1>
<b>注意，本生成器基于水鱼查分器 <a href="https://www.diving-fish.com/maimaidx/prober/" target="_blank">Diving-Fish</a>，使用前请先注册账号并上传数据。</b>
<p>获取 Rating 分数：<a href="https://dxrating.luoling.moe/api/getRating/luoling8192" target="_blank">https://dxrating.luoling.moe/api/getRating/luoling8192</a></p>
<p>生成 Rating 图片（可以嵌入到 Markdown 中使用）：<a href="https://dxrating.luoling.moe/api/genImage/luoling8192" target="_blank">https://dxrating.luoling.moe/api/genImage/luoling8192</a></p>
<p>使用前替换掉用户名就好啦～</p>
</body>
</html>
`, { headers: { 'Content-Type': 'text/html;charset=UTF-8' } });
});

export default app;
