import * as PIXI from 'pixi.js';
import Context from './Context';
import Button from './modules/Button';

export default class extends PIXI.Container {
	constructor() {
		super();
	}

	init(context) {
		this.r = {
			titlebg: "images/titlebg.jpg",
			back: "images/back.png",
			pict01: "images/pict01.jpg",
			pict02: "images/pict02.jpg",
			pict03: "images/pict03.jpg",
			pict04: "images/pict04.jpg",
		};
		this.context = context;
	}

	start() {
		PIXI.loader
			.add(this.r.titlebg)
			.add(this.r.back)
			.add(this.r.pict01)
			.add(this.r.pict02)
			.add(this.r.pict03)
			.add(this.r.pict04)
			.load(this.loadCompleted.bind(this));
	}

	loadCompleted() {
		let texture = PIXI.Texture.fromImage(this.r.titlebg);
		let back = PIXI.Texture.fromImage(this.r.back);
		let bg = new PIXI.Sprite(texture);
		let backBtn = new Button(back);
		this.addChild(bg);
		this.addChild(backBtn);
		let pictures = [
			{ img: this.r.pict01, x: 0, y: 0 },
			{ img: this.r.pict02, x: 150, y: 0 },
			{ img: this.r.pict03, x: 0, y: 150 },
			{ img: this.r.pict04, x: 150, y: 150 },
		];
		let pictRoot = new PIXI.Container();
		this.addChild(pictRoot);

		let self = this;
		for (let i = 0; i < pictures.length; ++i) {
			let data = pictures[i];
			let tex = PIXI.Texture.fromImage(data.img);
			let spr = new Button(tex);
			pictRoot.addChild(spr);
			spr.scale.set(0.25, 0.25);
			spr.position.set(data.x, data.y);
			spr.data = data;
			spr.onClick = function () {
				console.log("picture:" + data.img);
				self.context.selectPicture = data.img;
				self.context.changeScene(self.context.SCENE_ID_SELECTDIFFICULTY);
			};
		}
		pictRoot.position.set(40, 200);

		backBtn.onClick = this.onClickBack.bind(this);
		let titleText = new PIXI.Text('パズル選択', { fontFamily: 'Arial', fontSize: 30, fill: 0xFFFFFF, align: 'center' });
		this.addChild(titleText);
		this.context.calcCenterXPosition(titleText, this);
		titleText.position.y += 50;
	}

	onDestroy() {
		PIXI.loader.reset();
	}
	
	onClickBack() {
		console.log("onClickBack");
		this.context.changeScene(this.context.SCENE_ID_TITLE);
	}

	update() {
	}
}