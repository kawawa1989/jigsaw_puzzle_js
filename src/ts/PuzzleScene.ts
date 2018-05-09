import * as PIXI from 'pixi.js';
import { SceneBase } from './SceneBase';
import { Difficulty } from './Difficulty';
import { Button } from './modules/Button';
import { DraggableObject } from './modules/DraggableObject';
import { PuzzlePieceObject } from './modules/PuzzlePieceObject';
import { SceneID } from './SceneManager';

export class PuzzleScene extends SceneBase {
	public r: any = {
		back: "images/back.png",
		titlebg: "images/titlebg.jpg",
		button: "images/button01.png",
	};

	public pictWidth: number = 300;
	public pictHeight: number = 300;
	public draggingObject: PIXI.Container = null;
	public pictureTexture: PIXI.Texture = null;
	public pieceFrame: Array<PIXI.Container> = [];
	public pieces: Array<PuzzlePieceObject> = [];
	public pieceContainer: PIXI.Container = null;
	public frameContainer: PIXI.Container = null;
	public pieceXNum: number = 7;
	public pieceYNum: number = 7;


	constructor() {
		super();
		console.log("PuzzleScene!!");
	}

	onClickBack(): void {
		this.context.sceneManager.changeScene(SceneID.SelectPuzzle);
	}

	// 開始処理
	start(): void {
		if (this.context.selectDifficulty == Difficulty.Easy) {
			this.pieceXNum = 3;
			this.pieceYNum = 3;
		}
		else if (this.context.selectDifficulty == Difficulty.Normal) {
			this.pieceXNum = 5;
			this.pieceYNum = 5;
		}
		else if (this.context.selectDifficulty == Difficulty.Hard) {
			this.pieceXNum = 7;
			this.pieceYNum = 7;
		}

		this.context.sceneManager.loadTextureResources.push(this.r.titlebg);
		this.context.sceneManager.loadTextureResources.push(this.r.back);
		this.context.sceneManager.loadTextureResources.push(this.r.button);
		this.context.sceneManager.loadTextureResources.push(this.context.selectPictureName);
	}

	// ロード完了時イベント
	onLoadCompleted(): void {
		let backTexture = PIXI.Texture.fromImage(this.r.back);
		let bgTexture = PIXI.Texture.fromImage(this.r.titlebg);
		this.pictureTexture = PIXI.Texture.fromImage(this.context.selectPictureName);
		var pieceDataList = [];
		for (var y = 0; y < this.pieceYNum; ++y) {
			var row = [];
			for (var x = 0; x < this.pieceXNum; ++x) {
				row.push({ top: 0, right: 0, bottom: 0, left: 0 });
			}
			pieceDataList.push(row);
		}
		let bgSprite = new PIXI.Sprite(bgTexture);
		let backButton = new Button(backTexture);
		backButton.onClick = this.onClickBack.bind(this);

		this.pieceContainer = new PIXI.Container();
		this.frameContainer = new PIXI.Container();
		this.addChild(bgSprite);
		this.addChild(backButton);
		this.addChild(this.frameContainer);
		this.addChild(this.pieceContainer);

		this.frameContainer.position.set(30, 80);

		for (var y = 0; y < pieceDataList.length; ++y) {
			var row: Array<any> = pieceDataList[y];
			for (var x = 0; x < row.length; ++x) {
				var piece = row[x];
				piece.right = Math.pow(-1, Math.floor(Math.random() * 2));
				piece.bottom = Math.pow(-1, Math.floor(Math.random() * 2));
				if (x + 1 < row.length) {
					row[x + 1].left = -piece.right;
				}
				if (y + 1 < pieceDataList.length) {
					pieceDataList[y + 1][x].top = -piece.bottom;
				}


				if (x == row.length - 1) {
					piece.right = 0;
				}
				if (x == 0) {
					piece.left = 0;
				}
				if (y == 0) {
					piece.top = 0;
				}
				if (y == pieceDataList.length - 1) {
					piece.bottom = 0;
				}

				var posX = Math.random() * 250;
				var posY = 350 + (Math.random() * 100);
				var c = this.createPieceContainer(posX, posY, x, y, piece.top, piece.right, piece.bottom, piece.left);
				this.pieces.push(c);
				this.addChild(c);
				this.pieceContainer.addChild(c);
			}
		}

		for (var y = 0; y < pieceDataList.length; ++y) {
			var row: Array<any> = pieceDataList[y];
			for (var x = 0; x < row.length; ++x) {
				var piece = row[x];
				var contentWidth = this.pictWidth / this.pieceXNum;
				var obj = this.createPieceMask(piece.top, piece.right, piece.bottom, piece.left, contentWidth, false);
				obj.position.x = x * contentWidth;
				obj.position.y = y * contentWidth;
				this.frameContainer.addChild(obj);
				this.pieceFrame.push(obj);
			}
		}
		console.log("setup!!");
	}

	createPieceContainer(x, y, column, row, top, right, bottom, left): PuzzlePieceObject {
		var number = column + (row * this.pieceXNum);
		var contentWidth = this.pictWidth / this.pieceXNum;
		var container = new PuzzlePieceObject(number);
		var graphics = this.createPieceMask(top, right, bottom, left, contentWidth, true);
		var edge = this.createPieceMask(top, right, bottom, left, contentWidth, false);
		// スプライト生成
		var sprite = new PIXI.Sprite(this.pictureTexture);
		container.interactive = true;
		container.width = contentWidth;
		container.height = contentWidth;
		container.addChild(sprite);
		container.addChild(graphics);
		container.addChild(edge);
		container.onDragStartEvent = (obj) => {
			this.pieceContainer.removeChild(container);
			this.pieceContainer.addChild(container);
			console.log("pieceNumber:" + container.pieceNumber);
		};
		container.onDragEndEvent = (obj) => {
			console.log("onDragEnd!!");
			this.hitCheck(container);
			this.checkClear();
		};

		sprite.mask = graphics;
		container.position.x = x;
		container.position.y = y;
		sprite.width = this.pictWidth;
		sprite.height = this.pictHeight;
		sprite.position.x = -1 * column * contentWidth;
		sprite.position.y = -1 * row * contentWidth;
		return container;
	}

	checkClear(): boolean {
		for (var i = 0; i < this.pieces.length; ++i) {
			if (this.pieces[i].dragEnable) {
				return false;
			}
		}
		this.context.sceneManager.changeScene(SceneID.Result);
	}

	hitCheck(content: PuzzlePieceObject): void {
		var isHit = function (a, b) {
			// 当たり判定
			if (Math.abs(a.x - b.x) < (a.width / 2) + (b.width / 2) && Math.abs(a.y - b.y) < (a.height / 2) + (b.height / 2)) {
				return true;
			}
			return false;
		};

		var aw = content.width / 8;
		var ah = content.height / 8;
		var arect = {
			x: content.position.x + (content.width / 2),
			y: content.position.y + (content.height / 2),
			width: aw,
			height: ah
		};
		var brect = {
			x: 0,
			y: 0,
			width: 0,
			height: 0,
		};

		for (var i = 0; i < this.pieceFrame.length; ++i) {
			let f = this.pieceFrame[i];
			let bw = f.width / 8;
			let bh = f.height / 8;
			let pos = f.getGlobalPosition();

			brect.x = pos.x + (f.width / 2);
			brect.y = pos.y + (f.height / 2);
			brect.width = bw;
			brect.height = bh;
			if (isHit(arect, brect)) {
				console.log("hit!!");
				if (content.pieceNumber == i) {
					content.dragEnable = false;
					content.position.x = pos.x;
					content.position.y = pos.y;
					this.pieceContainer.setChildIndex(content, 0);
				}
			}
		}
	}

	update(): void {
	}

	onDestroy(): void {
	}

	createPieceMask(topTab: number, rightTab: number, bottomTab: number, leftTab: number, tileWidth: number, fill: boolean): PIXI.Graphics {
		var tileDefault = 100;
		var tileRatio = tileWidth / tileDefault;
		var mask = new PIXI.Graphics();
		if (fill) {
			mask.beginFill(0x494949);
		}
		else {
			mask.lineStyle(2, 0x000000, 1);
		}
		var curvyCoords = [
			0, 0, 35, 15, 37, 5,
			37, 5, 40, 0, 38, -5,
			38, -5, 20, -20, 50, -20,
			50, -20, 80, -20, 62, -5,
			62, -5, 60, 0, 63, 5,
			63, 5, 65, 15, 100, 0
		];
		for (var i = 0; i < curvyCoords.length; ++i) {
			curvyCoords[i] *= tileRatio;
		}
		var topLeftEdge = { x: 0, y: 0 };
		mask.moveTo(topLeftEdge.x, topLeftEdge.y);

		//Top
		for (var i = 0; i < curvyCoords.length / 6; i++) {
			var p1 = { x: topLeftEdge.x + (curvyCoords[i * 6 + 0]), y: topLeftEdge.y + (topTab * curvyCoords[i * 6 + 1]) };
			var p2 = { x: topLeftEdge.x + (curvyCoords[i * 6 + 2]), y: topLeftEdge.y + (topTab * curvyCoords[i * 6 + 3]) };
			var p3 = { x: topLeftEdge.x + (curvyCoords[i * 6 + 4]), y: topLeftEdge.y + (topTab * curvyCoords[i * 6 + 5]) };
			mask.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
		}
		//Right
		var topRightEdge = { x: topLeftEdge.x + tileWidth, y: topLeftEdge.y + 0 };
		for (var i = 0; i < curvyCoords.length / 6; i++) {
			var p1 = { x: topRightEdge.x + (-rightTab * curvyCoords[i * 6 + 1]), y: topRightEdge.y + (curvyCoords[i * 6 + 0]) };
			var p2 = { x: topRightEdge.x + (-rightTab * curvyCoords[i * 6 + 3]), y: topRightEdge.y + (curvyCoords[i * 6 + 2]) };
			var p3 = { x: topRightEdge.x + (-rightTab * curvyCoords[i * 6 + 5]), y: topRightEdge.y + (curvyCoords[i * 6 + 4]) };
			mask.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
		}
		//Bottom
		var bottomRightEdge = { x: topRightEdge.x + 0, y: topRightEdge.y + tileWidth };
		for (var i = 0; i < curvyCoords.length / 6; i++) {
			var p1 = { x: bottomRightEdge.x - (curvyCoords[i * 6 + 0]), y: bottomRightEdge.y - (bottomTab * curvyCoords[i * 6 + 1]) };
			var p2 = { x: bottomRightEdge.x - (curvyCoords[i * 6 + 2]), y: bottomRightEdge.y - (bottomTab * curvyCoords[i * 6 + 3]) };
			var p3 = { x: bottomRightEdge.x - (curvyCoords[i * 6 + 4]), y: bottomRightEdge.y - (bottomTab * curvyCoords[i * 6 + 5]) };
			mask.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
		}
		//Left
		var bottomLeftEdge = { x: bottomRightEdge.x - tileWidth, y: bottomRightEdge.y - 0 };
		for (var i = 0; i < curvyCoords.length / 6; i++) {
			var p1 = { x: bottomLeftEdge.x - (-leftTab * curvyCoords[i * 6 + 1]), y: bottomLeftEdge.y - (curvyCoords[i * 6 + 0]) };
			var p2 = { x: bottomLeftEdge.x - (-leftTab * curvyCoords[i * 6 + 3]), y: bottomLeftEdge.y - (curvyCoords[i * 6 + 2]) };
			var p3 = { x: bottomLeftEdge.x - (-leftTab * curvyCoords[i * 6 + 5]), y: bottomLeftEdge.y - (curvyCoords[i * 6 + 4]) };
			mask.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
		}
		if (fill) {
			mask.endFill();
		}
		return mask;
	}
}