// https://github.com/ekkusu-3800mhz/maimai-b50-simulator
// https://github.com/ekkusu-3800mhz/maimai-b50-simulator/pull/1

import { IMusicChart, IResponse } from './datasource';
import { sumRa, updateRa } from './functions';

export default (data: IResponse) => {
	const b35List: Array<IMusicChart> = updateRa(data.charts.sd);
	const b15List: Array<IMusicChart> = updateRa(data.charts.dx);
	// Calculate rating
	const b35: number = sumRa(b35List);
	const b15: number = sumRa(b15List);
	return b35 + b15;
}
