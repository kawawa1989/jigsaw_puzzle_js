import * as PIXI from 'pixi.js';

// シーンのテンプレート
// 追加するときはここのコードをコピペして使います。
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
	}

	// リソースのロード完了時に呼び出します(これはシーン側で任意に行う)
	loadCompleted() {
	}

	// シーン終了時に呼び出します
	onDestroy() {
	}

	// シーンの更新処理として呼び出されます
	update() {
	}
}