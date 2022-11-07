import { Rectangle } from './Rectangle';

export class Word extends Rectangle {
	constructor(word: string, x: number, y: number, rotation: number) {
		super(x, y, word.length * 28, 64, rotation);
	}
}
