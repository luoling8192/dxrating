import { IMusicChart } from './datasource';

// Enum of achievements
enum Achievement {
	C = 50.0,
	B = 60.0,
	BB = 70.0,
	BBB = 75.0,
	A = 80.0,
	AA = 90.0,
	AAA = 94.0,
	S = 97.0,
	Sp = 98.0,
	SS = 99.0,
	SSp = 99.5,
	SSS = 100.0,
	SSSp = 100.5
}

// Splash+ rating algorithm
// ref: https://github.com/Yuri-YuzuChaN/maimaiDX/blob/main/libraries/maimai_best_40.py#L406
function computeRa(ds: number, achievement: number): number {
	let baseRa: number = 22.4;
	if (achievement < Achievement.C) {
		baseRa = 0.0;
	} else if (achievement < Achievement.B) {
		baseRa = 8.0;
	} else if (achievement < Achievement.BB) {
		baseRa = 9.6;
	} else if (achievement < Achievement.BBB) {
		baseRa = 11.2;
	} else if (achievement < Achievement.A) {
		baseRa = 12.0;
	} else if (achievement < Achievement.AA) {
		baseRa = 13.6;
	} else if (achievement < Achievement.AAA) {
		baseRa = 15.2;
	} else if (achievement < Achievement.S) {
		baseRa = 16.8;
	} else if (achievement < Achievement.Sp) {
		baseRa = 20.0;
	} else if (achievement < Achievement.SS) {
		baseRa = 20.3;
	} else if (achievement < Achievement.SSp) {
		baseRa = 20.8;
	} else if (achievement < Achievement.SSS) {
		baseRa = 21.1;
	} else if (achievement < Achievement.SSSp) {
		baseRa = 21.6;
	}
	return Math.floor(ds * (Math.min(100.5, achievement) / 100) * baseRa);
}

// Use new algorithm to update chart data
export function updateRa(charts: Array<IMusicChart>): Array<IMusicChart> {
	let arr: Array<IMusicChart> = [];
	charts.forEach((music: IMusicChart) => {
		music.ra = computeRa(music.ds, music.achievements);
		arr.push(music);
	});
	return arr;
}

// Sum rating in chart data array
export function sumRa(charts: Array<IMusicChart>): number {
	let ra: number = 0;
	charts.forEach((music: IMusicChart) => {
		ra += music.ra;
	});
	return ra;
}
