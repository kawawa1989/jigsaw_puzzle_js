import * as PIXI from 'pixi.js';
import Context from './Context';

export default class extends PIXI.Container {
	constructor() {
		super();
	}

	init(context) {
		this.context = context;
	}

	start() {
		PIXI.loader
			.add("images/titlebg.jpg")
			.add("images/button01.png")
			.load(this.loadCompleted.bind(this));
	}

	loadCompleted() {
		let texture = PIXI.Texture.fromImage("images/titlebg.jpg");
		let buttonTexture = PIXI.Texture.fromImage("images/button01.png");
		let sprite = new PIXI.Sprite(texture);
		let buttonSprite = new PIXI.Sprite(buttonTexture);
		this.addChild(sprite);
		this.addChild(buttonSprite);
		buttonSprite.interactive = true;
		buttonSprite.on('click', this.onClickTitle.bind(this));
		buttonSprite.on('touchend', this.onClickTitle.bind(this));

		let text = new PIXI.Text('スタート！', { fontFamily: 'Arial', fontSize: 24, fill: 0xff1010, align: 'center' });
		text.position.x = 30;
		text.position.y = 30;
		buttonSprite.addChild(text);
	}

	onClickTitle() {
		this.context.changeScene(this.context.SCENE_ID_PUZZLE);
	}

	update() {
	}
}