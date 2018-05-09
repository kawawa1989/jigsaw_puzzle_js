import * as PIXI from 'pixi.js';
import { Button } from './modules/Button';
import { TextButton } from './modules/TextButton';
import { SceneBase } from './SceneBase';
import { SceneID } from './SceneManager';
import { Difficulty } from './Difficulty';


export class SelectDifficultyScene extends SceneBase {
	public r: any = {
		titlebg: "images/titlebg.jpg",
		back: "images/back.png",
		button: "images/button01.png",
	};

	constructor() {
		super();
	}

	start(): void {
		this.context.sceneManager.loadTextureResources.push(this.r.titlebg);
		this.context.sceneManager.loadTextureResources.push(this.r.back);
		this.context.sceneManager.loadTextureResources.push(this.r.button);
	}
	
	onLoadCompleted(): void {
		let texture = PIXI.Texture.fromImage(this.r.titlebg);
		let back = PIXI.Texture.fromImage(this.r.back);
		let buttonImage = PIXI.Texture.fromImage(this.r.button);

		let bg = new PIXI.Sprite(texture);
		let backBtn = new Button(back);
		backBtn.onClick = this.onClickBack.bind(this);

		this.addChild(bg);
		this.addChild(backBtn);

		let easy = new TextButton(buttonImage, this.context, "簡単");
		let normal = new TextButton(buttonImage, this.context, "普通");
		let hard = new TextButton(buttonImage, this.context, "難しい");
		let buttonRoot = new PIXI.Container();
		this.addChild(buttonRoot);
		buttonRoot.addChild(easy);
		buttonRoot.addChild(normal);
		buttonRoot.addChild(hard);

		buttonRoot.position.set(80, 200);

		let buttons = [
			{ btn: easy, difficulty: Difficulty.Easy },
			{ btn: normal, difficulty: Difficulty.Normal },
			{ btn: hard, difficulty: Difficulty.Hard },
		];
		for (let i = 0; i < buttons.length; ++i) {
			let data = buttons[i];
			let button = data.btn;
			button.position.set(0, i * 100);
			button.onClick = () => {
				this.context.selectDifficulty = data.difficulty;
				this.context.sceneManager.changeScene(SceneID.Puzzle);
			};
		}

		let titleText = new PIXI.Text('難易度を\n選んでください', { fontFamily: 'Arial', fontSize: 30, fill: 0xFFFFFF, align: 'center' });
		this.addChild(titleText);
		this.context.calcCenterXPosition(titleText, this);
		titleText.position.y += 50;
	}

	onDestroy(): void {
	}

	onClickBack(): void {
		this.context.sceneManager.changeScene(SceneID.SelectPuzzle);
	}

	update(): void {
	}
}