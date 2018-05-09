import { SceneBase } from "./SceneBase";
import { TitleScene } from "./TitleScene";
import { GameContext } from "./GameContext";
import { SelectPuzzleScene } from "./SelectPuzzleScene";
import { SelectDifficultyScene } from "./SelectDifficultyScene";
import { PuzzleScene } from "./PuzzleScene";
import { ResultScene } from "./ResultScene";

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
	public loadTextureResources: Array<string> = [];

	public createSceneFunc: Array<CreateSceneFuncDelegate> = [
		() => { return new TitleScene() },
		() => { return new SelectPuzzleScene() },
		() => { return new SelectDifficultyScene() },
		() => { return new PuzzleScene() },
		() => { return new ResultScene() },
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

				// ロードしたテクスチャを削除する
				for (let i = 0; i < this.loadTextureResources.length; ++i) {
					let path = this.loadTextureResources[i];
					let texture = PIXI.Texture.fromImage(path);
					texture.destroy();
					PIXI.BaseTexture.removeFromCache(path);
					PIXI.Texture.removeFromCache(path);
					console.log("texture unload path:" + path);
				}
				PIXI.loader.reset();
				this.loadTextureResources = [];
				console.log("reset resources:" + JSON.stringify(PIXI.loader.resources));
			}
		}
		if (this.scene == null) {
			this.scene = this.createSceneFunc[this.sceneId]();
			if (this.scene != null) {
				this.scene.init(this.context);
				this.scene.start();

				// シーン開始前に読み込むべきテクスチャをロードする
				for (let i = 0; i < this.loadTextureResources.length; ++i) {
					let path = this.loadTextureResources[i];
					console.log("load:" + path);
					PIXI.loader.add(path);
				}
				PIXI.loader.load(() => { this.scene.onLoadCompleted(); });
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

