import * as PIXI from 'pixi.js';
import Button from './Button';

export default class extends Button {
	constructor(texture, context, text, fontSize, textColor) {
		super(texture);
		if (fontSize == undefined) {
			fontSize = 30;
		}
		if (textColor == undefined) {
			textColor = 0x000000;
		}
		this.text = new PIXI.Text(text, { fontFamily: 'Arial', fontSize: fontSize, fill: textColor, align: 'center' });
		this.addChild(this.text);
		this.context = context;
		this.context.calcCenterPosition(this.text, this);
	}
}