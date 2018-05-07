import * as PIXI from 'pixi.js';
import Context from './Context';


var type = "WebGL";
if (!PIXI.utils.isWebGLSupported()) {
	type = "canvas"
}
PIXI.utils.sayHello(type);


// 新しいレンダラー作る
// 720 * 1280
var renderer = PIXI.autoDetectRenderer(360, 640, { antialias: true, backgroundColor: 0xDDDDDD });
var h = window.innerHeight / 640;
console.log("height:" + window.height + "," + window.innerHeight);
renderer.view.style.width = (360 * h) + 'px';
renderer.view.style.height = (640 * h) + 'px';


// それをHTMLファイルに入れる
document.body.appendChild(renderer.view);


var context = new Context();
/**
 * animation関数を定義
 */
var animation = function () {
	// 再帰的に次のアニメーションフレームで animation関数を呼び出す
	requestAnimationFrame(animation);
	context.render();
	if (context.scene != null) {
		// 描画
		renderer.render(context.scene);
	}

};
animation();