import * as PIXI from 'pixi.js';
import { GameContext } from './GameContext';
import { TextButton } from './modules/TextButton';
import { SceneBase } from './SceneBase';
import { SceneID } from './SceneManager';

export class TitleScene extends SceneBase {
	constructor() {
		super();
	}

	start(): void {
		PIXI.loader
			.add("images/titlebg.jpg")
			.add("images/button01.png")
			.load(this.loadCompleted.bind(this));
	}

	loadCompleted(): void {
		let backgroundTexture = PIXI.Texture.fromImage("images/titlebg.jpg");
		let buttonTexture = PIXI.Texture.fromImage("images/button01.png");
		let background = new PIXI.Sprite(backgroundTexture);
		let startButton = new TextButton(buttonTexture, this.context, "スタート");
		let titleText = new PIXI.Text('ジグソーパズル', { fontFamily: 'Arial', fontSize: 30, fill: 0xFFFFFF, align: 'center' });

		this.addChild(background);
		this.addChild(startButton);
		this.addChild(titleText);
		startButton.onClick = this.onClickTitle.bind(this);

		this.context.calcCenterPosition(startButton, this);
		startButton.position.y += 100;

		this.context.calcCenterXPosition(titleText, this);
		titleText.position.y += 50;
	}

	onDestroy(): void {
	}

	onClickTitle(): void {
		this.context.sceneManager.changeScene(SceneID.SelectPuzzle);
		console.log("onClickTitle!!");
	}

	update(): void {
	}
}