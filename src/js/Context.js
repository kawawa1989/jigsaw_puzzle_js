import * as PIXI from 'pixi.js';
import PuzzleScene from './PuzzleScene';
import PuzzleSelectScene from './PuzzleSelectScene';
import TitleScene from './TitleScene';
import SelectDifficultyScene from './SelectDifficultyScene';
import ResultScene from './ResultScene';


export default class {
	constructor() {
		this.screenWidth = 360;
		this.screenHeight = 640;
		this.SCENE_ID_TITLE = 'TitleScene';
		this.SCENE_ID_PUZZLESELECT = 'PuzzleSelectScene';
		this.SCENE_ID_SELECTDIFFICULTY = 'SelectDifficulty';
		this.SCENE_ID_PUZZLE = 'PuzzleScene';
		this.SCENE_ID_RESULT = 'ResultScene';

		this.createSceneFunc = {};
		this.createSceneFunc[this.SCENE_ID_TITLE] = function () { return new TitleScene() };
		this.createSceneFunc[this.SCENE_ID_PUZZLESELECT] = function () { return new PuzzleSelectScene() };
		this.createSceneFunc[this.SCENE_ID_SELECTDIFFICULTY] = function () { return new SelectDifficultyScene() };
		this.createSceneFunc[this.SCENE_ID_PUZZLE] = function () { return new PuzzleScene() };
		this.createSceneFunc[this.SCENE_ID_RESULT] = function () { return new ResultScene() };

		this.scene = null;
		this.sceneId = '';
		this.nextSceneId = this.SCENE_ID_TITLE;

		this.DIFFICULTY_EASY = 0;
		this.DIFFICULTY_NORMAL = 1;
		this.DIFFICULTY_HARD = 2;
		this.selectPicture = "";
		this.difficulty = 0;
	}

	changeScene(nextId) {
		this.nextSceneId = nextId;
	}

	calcCenterPosition(content, parent) {
		var posX = (parent.width - content.width) / 2;
		var posY = (parent.height - content.height) / 2;
		content.position.set(posX, posY);
	}

	calcCenterXPosition(content, parent) {
		var posX = (parent.width - content.width) / 2;
		content.position.x = posX;
	}

	calcCenterYPosition(content, parent) {
		var posY = (parent.height - content.height) / 2;
		content.position.y = posY;
	}

	render() {
		// 再帰的に次のアニメーションフレームで animation関数を呼び出す
		if (this.sceneId != this.nextSceneId) {
			this.sceneId = this.nextSceneId;
			if (this.scene != null) {
				this.scene.onDestroy();
				this.scene.destroy(true);
				this.scene = null;
				PIXI.loader.reset();
			}
		}
		if (this.scene == null) {
			this.scene = this.createSceneFunc[this.sceneId]();
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
