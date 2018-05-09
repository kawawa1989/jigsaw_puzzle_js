import * as PIXI from 'pixi.js';
import { TitleScene } from './TitleScene';
import { SceneID, SceneManager } from './SceneManager';
import { SceneBase } from './SceneBase';
import { Difficulty } from './Difficulty';



export class GameContext {
	public screenWidth: number = 360;
	public screenHeight: number = 640;
	public sceneManager: SceneManager;
	public selectDifficulty: Difficulty;
	public selectPictureName: string;

	constructor() {
		console.log("context created!!");
		this.sceneManager = new SceneManager(this);
	}

	public update(): void {
		this.sceneManager.update();
	}

	get container(): PIXI.Container {
		return this.sceneManager.scene;
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