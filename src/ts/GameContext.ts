import * as PIXI from 'pixi.js';
import { JigsawPuzzle } from './TitleScene';

export class GameContext {
	public screenWidth: number = 360;
	public screenHeight: number = 640;
	public scene: PIXI.Container = null;

	constructor() {
		console.log("context created!!");
		this.scene = new JigsawPuzzle.TitleScene;
	}

	public render(): void {
	}

	public calcCenterPosition(content: PIXI.Container, parent: PIXI.Container): void {
		var posX = (parent.width - content.width) / 2;
		var posY = (parent.height - content.height) / 2;
		content.position.set(posX, posY);
	}

	public calcCenterXPosition(content, parent): void {
		var posX = (parent.width - content.width) / 2;
		content.position.x = posX;
	}

	public calcCenterYPosition(content, parent): void {
		var posY = (parent.height - content.height) / 2;
		content.position.y = posY;
	}
}