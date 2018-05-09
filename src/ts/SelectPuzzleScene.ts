import * as PIXI from 'pixi.js';
import { Button } from './modules/Button';
import { SceneBase } from './SceneBase';
import { SceneID } from './SceneManager';

export class SelectPuzzleScene extends SceneBase {
	public r: any = {
		titlebg: "images/titlebg.jpg",
		back: "images/back.png",
		pict01: "images/pict01.png",
		pict02: "images/pict02.png",
		pict03: "images/pict03.png",
		pict04: "images/pict04.jpg",
	};

	constructor() {
		super();
	}

	start(): void {
		this.context.sceneManager.loadTextureResources.push(this.r.titlebg);
		this.context.sceneManager.loadTextureResources.push(this.r.back);
		this.context.sceneManager.loadTextureResources.push(this.r.pict01);
		this.context.sceneManager.loadTextureResources.push(this.r.pict02);
		this.context.sceneManager.loadTextureResources.push(this.r.pict03);
		this.context.sceneManager.loadTextureResources.push(this.r.pict04);
	}

	onLoadCompleted(): void {
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
			spr.width = 128;
			spr.height = 128;
			//spr.scale.set(0.25, 0.25);
			spr.position.set(data.x, data.y);
			spr.onClick = () => {
				console.log("picture:" + data.img);
				self.context.selectPictureName = data.img;
				self.context.sceneManager.changeScene(SceneID.SelectDifficulty);
			};
		}
		pictRoot.position.set(40, 200);

		backBtn.onClick = this.onClickBack.bind(this);
		let titleText = new PIXI.Text('パズル選択', { fontFamily: 'Arial', fontSize: 30, fill: 0xFFFFFF, align: 'center' });
		this.addChild(titleText);
		this.context.calcCenterXPosition(titleText, this);
		titleText.position.y += 50;
	}

	onDestroy(): void {
	}

	onClickBack(): void {
		console.log("onClickBack");
		this.context.sceneManager.changeScene(SceneID.Title);
	}

	update(): void {
	}
}