import { SceneBase } from "./SceneBase";
import { TitleScene } from "./TitleScene";
import { GameContext } from "./GameContext";
import { SelectPuzzleScene } from "./SelectPuzzleScene";

export enum SceneID {
	None = -1,
	Title,
	SelectPuzzle,
	SelectDifficulty,
	Puzzle,
	Result,
}

export interface CreateSceneFuncDelegate {
	(): SceneBase;
}

export class SceneManager {
	public scene: SceneBase = null;
	public sceneId: SceneID = SceneID.None;
	public nextSceneId: SceneID = SceneID.Title;
	public context: GameContext;

	public createSceneFunc: Array<CreateSceneFuncDelegate> = [
		() => { return new TitleScene() },
		() => { return new SelectPuzzleScene() },
	];

	constructor(context: GameContext) {
		this.context = context;
	}

	update(): void {
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
				this.scene.init(this.context);
				this.scene.start();
			}
		}
		if (this.scene != null) {
			this.scene.update();
		}
	}

	changeScene(nextSceneId: SceneID): void {
		this.nextSceneId = nextSceneId;
	}
}

