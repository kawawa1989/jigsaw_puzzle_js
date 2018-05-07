import * as PIXI from 'pixi.js';
import PuzzleScene from './PuzzleScene';
import TitleScene from './TitleScene';


export default class {
	constructor() {
		this.SCENE_ID_TITLE = 1;
		this.SCENE_ID_PUZZLE = 2;

		this.scene = null;
		this.sceneId = 0;
		this.nextSceneId = this.SCENE_ID_TITLE;
	}


	changeScene(nextId) {
		this.nextSceneId = nextId;
	}

	render() {
		// 再帰的に次のアニメーションフレームで animation関数を呼び出す
		if (this.sceneId != this.nextSceneId) {
			this.sceneId = this.nextSceneId;
			if (this.scene != null) {
				this.scene.destroy(true);
				this.scene = null;
			}
		}

		if (this.scene == null) {
			switch (this.sceneId) {
				case 1:
					this.scene = new TitleScene();
					break;
				case 2:
					this.scene = new PuzzleScene();
					break;
			}
			if (this.scene != null) {
				this.scene.init(this);
				this.scene.start();
			}
		}

		if (this.scene != null) {
			this.scene.update();
		}
	}
}
