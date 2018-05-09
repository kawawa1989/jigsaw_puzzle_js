import * as PIXI from 'pixi.js';
import { GameContext } from './GameContext';

export namespace JigsawPuzzle {
	export class TitleScene extends PIXI.Container {
		public context: GameContext
		constructor() {
			super();
		}

		init(context: GameContext) {
			this.context = context;
		}

		start() {
			PIXI.loader
				.add("images/titlebg.jpg")
				.add("images/button01.png")
				.load(this.loadCompleted.bind(this));
		}

		loadCompleted() {
			let backgroundTexture = PIXI.Texture.fromImage("images/titlebg.jpg");
			let buttonTexture = PIXI.Texture.fromImage("images/button01.png");
			let background = new PIXI.Sprite(backgroundTexture);
			let titleText = new PIXI.Text('ジグソーパズル', { fontFamily: 'Arial', fontSize: 30, fill: 0xFFFFFF, align: 'center' });


			this.addChild(background);
			this.addChild(titleText);
		}

		onDestroy() {
		}

		onClickTitle() {
			console.log("onClickTitle!!");
		}
		
		update() {
		}
	}
}