import { GameContext } from "./GameContext";

export class SceneBase extends PIXI.Container {
	public context: GameContext = null;
	init(context: GameContext): void {
		this.context = context;
	}

	start(): void {
	}

	update(): void {
	}

	onDestroy(): void {
	}
}