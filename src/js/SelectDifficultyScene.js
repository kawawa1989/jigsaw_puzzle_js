import * as PIXI from 'pixi.js';
import Context from './Context';
import Button from './modules/Button';
import TextButton from './modules/TextButton';

export default class extends PIXI.Container {
	constructor() {
		super();
	}

	init(context) {
		this.r = {
			titlebg: "images/titlebg.jpg",
			back: "images/back.png",
			button: "images/button01.png",
		};
		this.context = context;
	}

	start() {
		PIXI.loader
			.add(this.r.titlebg)
			.add(this.r.back)
			.add(this.r.button)
			.load(this.loadCompleted.bind(this));
	}

	loadCompleted() {
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
			{ btn: easy, difficulty: this.context.DIFFICULTY_EASY },
			{ btn: normal, difficulty: this.context.DIFFICULTY_NORMAL },
			{ btn: hard, difficulty: this.context.DIFFICULTY_HARD },
		];
		for (let i = 0; i < buttons.length; ++i) {
			let button = buttons[i].btn;
			button.position.set(0, i * 100);
			button.difficulty = buttons[i].difficulty;
			button.onClick = function () {
				this.context.difficulty = this.difficulty;
				this.context.changeScene(this.context.SCENE_ID_PUZZLE);
			};
		}


		let titleText = new PIXI.Text('難易度を\n選んでください', { fontFamily: 'Arial', fontSize: 30, fill: 0xFFFFFF, align: 'center' });
		this.addChild(titleText);
		this.context.calcCenterXPosition(titleText, this);
		titleText.position.y += 50;
	}

	onDestroy() {
	}

	onClickBack() {
		this.context.changeScene(this.context.SCENE_ID_PUZZLESELECT);
	}

	update() {
	}
}