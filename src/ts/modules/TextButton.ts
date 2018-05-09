import * as PIXI from 'pixi.js';
import { Button } from './Button';
import { GameContext } from '../GameContext';

export class TextButton extends Button {
	public text: PIXI.Text;
	public context: GameContext; // TODO: Utilityクラスとかにする

	constructor(texture: PIXI.Texture, context: GameContext, text: string, fontSize: number = 30, textColor: number = 0x000000) {
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