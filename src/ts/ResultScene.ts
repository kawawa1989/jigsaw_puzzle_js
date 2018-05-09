import * as PIXI from 'pixi.js';
import { SceneBase } from './SceneBase';
import { TextButton } from './modules/TextButton';
import { SceneID } from './SceneManager';

// パズル完成シーン
export class ResultScene extends SceneBase {
	public r: any = {
		titlebg: "images/titlebg.jpg",
		button: "images/button01.png",
	};

	constructor() {
		super();
	}

	// シーン生成時に呼び出されます
	init(context) {
		this.context = context;
	}

	// シーン開始時に呼び出されます
	start() {
		this.context.sceneManager.loadTextureResources.push(this.r.titlebg);
		this.context.sceneManager.loadTextureResources.push(this.r.button);
		this.context.sceneManager.loadTextureResources.push(this.context.selectPictureName);
	}

	// リソースのロード完了時に呼び出します(これはシーン側で任意に行う)
	onLoadCompleted() {
		let backgroundTexture = PIXI.Texture.fromImage("images/titlebg.jpg");
		let buttonTexture = PIXI.Texture.fromImage("images/button01.png");
		let pictureTex = PIXI.Texture.fromImage(this.context.selectPictureName);

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
		this.context.sceneManager.changeScene(SceneID.SelectPuzzle);
	}
}