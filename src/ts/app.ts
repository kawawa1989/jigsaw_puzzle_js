import * as PIXI from 'pixi.js';
import { GameContext } from "./GameContext";

var type = "WebGL";
if (!PIXI.utils.isWebGLSupported()) {
	type = "canvas"
}
PIXI.utils.sayHello(type);

var context = new GameContext();
var width = context.screenWidth;
var height = context.screenHeight;
var renderer = PIXI.autoDetectRenderer(width, height, { antialias: true, backgroundColor: 0xDDDDDD });
var scale = window.innerHeight / height;
console.log("height:" + window.innerHeight);
renderer.view.style.display = "block";
renderer.view.style.width = (width * scale) + 'px';
renderer.view.style.height = (height * scale) + 'px';
renderer.view.style.marginLeft = "auto";
renderer.view.style.marginRight = "auto";


console.log("screen width:" + context.screenWidth + ",height:" + context.screenHeight);

// それをHTMLファイルに入れる
document.body.appendChild(renderer.view);

/**
 * animation関数を定義
 */
var animation = function () {
	// 再帰的に次のアニメーションフレームで animation関数を呼び出す
	requestAnimationFrame(animation);
	context.update();
	if (context.container != null) {
		// 描画
		renderer.render(context.container);
	}
};
animation();
