import * as PIXI from 'pixi.js';
import TextButton from './modules/TextButton';

// パズル完成シーン
export default class extends PIXI.Container {
	constructor() {
		super();
	}

	// シーン生成時に呼び出されます
	init(context) {
		this.context = context;
	}

	// シーン開始時に呼び出されます
	start() {
		PIXI.loader
			.add("images/titlebg.jpg")
			.add("images/button01.png")
			.add(this.context.selectPicture)
			.load(this.loadCompleted.bind(this));
	}

	// リソースのロード完了時に呼び出します(これはシーン側で任意に行う)
	loadCompleted() {
		let backgroundTexture = PIXI.Texture.fromImage("images/titlebg.jpg");
		let buttonTexture = PIXI.Texture.fromImage("images/button01.png");
		let pictureTex = PIXI.Texture.fromImage(this.context.selectPicture);

		let background = new PIXI.Sprite(backgroundTexture);
		let okButton = new TextButton(buttonTexture, this.context, "OK");
		let picture = new PIXI.Sprite(pictureTex);
		let titleText = new PIXI.Text('パズル完成！', { fontFamily: 'Arial', fontSize: 30, fill: 0xFFFFFF, align: 'center' });
		picture.width = 300;
		picture.height = 300;

		this.addChild(background);
		this.addChild(picture);
		this.addChild(okButton);
		this.addChild(titleText);


		okButton.onClick = this.onClickOK.bind(this);

		this.context.calcCenterPosition(okButton, this);
		okButton.position.y += 200;

		this.context.calcCenterXPosition(titleText, this);
		titleText.position.y += 50;
		
		this.context.calcCenterXPosition(picture, this);
		picture.position.y += 100;
	}

	// シーン終了時に呼び出します
	onDestroy() {
	}

	// シーンの更新処理として呼び出されます
	update() {
	}

	onClickOK() {
		this.context.changeScene(this.context.SCENE_ID_PUZZLESELECT);
	}
}