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
	}

	onClickTitle() {
		this.context.changeScene(this.context.SCENE_ID_PUZZLE);
	}

	update() {
	}
}