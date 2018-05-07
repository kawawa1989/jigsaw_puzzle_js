import * as PIXI from 'pixi.js';

export default class extends PIXI.Container {
	constructor() {
		super();
		this.draggingObject = null;
		this.pictureTexture = null;
		this.pieceFrame = [];
		this.pieces = [];
		this.pieceContainer = null;
		this.frameContainer = null;
		this.pieceXNum = 7;
		this.pieceYNum = 7;
		console.log("PuzzleScene!!");
	}

	init(context) {
		this.context = context;
	}

	// 開始処理
	start() {
		PIXI.loader
			.add("images/picture01.png")
			.load(this.loadCompleted.bind(this));
	}

	// ロード完了時イベント
	loadCompleted() {
		this.pictureTexture = PIXI.Texture.fromImage("images/picture01.png");
		var pieceDataList = [];
		for (var y = 0; y < this.pieceYNum; ++y) {
			var row = [];
			for (var x = 0; x < this.pieceXNum; ++x) {
				row.push({ top: 0, right: 0, bottom: 0, left: 0 });
			}
			pieceDataList.push(row);
		}
		this.pieceContainer = new PIXI.Container();
		this.frameContainer = new PIXI.Container();
		this.addChild(this.frameContainer);
		this.addChild(this.pieceContainer);

		for (var y = 0; y < pieceDataList.length; ++y) {
			var row = pieceDataList[y];
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
				var posY = 300 + (Math.random() * 200);
				var c = this.createPieceContainer(posX, posY, x, y, piece.top, piece.right, piece.bottom, piece.left);
				this.pieces.push(c);
				this.addChild(c);
				this.pieceContainer.addChild(c);
			}
		}

		for (var y = 0; y < pieceDataList.length; ++y) {
			var row = pieceDataList[y];
			for (var x = 0; x < row.length; ++x) {
				var piece = row[x];
				var contentWidth = this.pictureTexture.width / this.pieceXNum;
				var obj = this.createPieceMask(piece.top, piece.right, piece.bottom, piece.left, contentWidth, false);
				obj.position.x = x * contentWidth;
				obj.position.y = y * contentWidth;
				this.frameContainer.addChild(obj);
				this.pieceFrame.push(obj);
			}
		}
		console.log("setup!!");
	}

	createPieceContainer(x, y, column, row, top, right, bottom, left) {
		var contentWidth = this.pictureTexture.width / this.pieceXNum;
		var container = new PIXI.Container();
		var graphics = this.createPieceMask(top, right, bottom, left, contentWidth, true);
		var edge = this.createPieceMask(top, right, bottom, left, contentWidth, false);
		// スプライト生成
		var sprite = new PIXI.Sprite(this.pictureTexture);
		container.interactive = true;
		container.width = contentWidth;
		container.addChild(sprite);
		container.addChild(graphics);
		container.addChild(edge);

		sprite.mask = graphics;
		container.position.x = x;
		container.position.y = y;
		sprite.width = this.pictureTexture.width;
		sprite.height = this.pictureTexture.height;
		sprite.position.x = -1 * column * contentWidth;
		sprite.position.y = -1 * row * contentWidth;


		// ドラッグを開始
		container.scene = this;
		container.on('mousedown', this.onDragStart)
		container.on('touchstart', this.onDragStart)
		// ドロップ（ドラッグを終了）
		container.on('mouseup', this.onDragEnd)
		container.on('mouseupoutside', this.onDragEnd)
		container.on('touchend', this.onDragEnd)
		container.on('touchendoutside', this.onDragEnd)
		// ドラッグ中
		container.on('mousemove', this.onDragMove)
		container.on('touchmove', this.onDragMove)
		container.pieceNumber = column + (row * this.pieceXNum);
		container.set = false;
		return container;
	}

	onDragStart(event) {
		if (this.scene.draggingObject) {
			return;
		}
		if (this.set) {
			return;
		}
		this.scene.pieceContainer.removeChild(this);
		this.scene.pieceContainer.addChild(this);

		console.log("pieceNumber:" + this.pieceNumber);
		this.scene.draggingObject = this;
		var pos = event.data.getLocalPosition(this.parent);
		this.distance = { x: 0, y: 0 };
		this.distance.x = this.position.x - pos.x;
		this.distance.y = this.position.y - pos.y;

		// store a reference to the data
		// the reason for this is because of multitouch
		// we want to track the movement of this particular touch
		this.data = event.data;
		this.alpha = 0.5;
		this.dragging = true;
	}

	onDragEnd() {
		this.alpha = 1;
		this.dragging = false;
		// set the interaction data to null
		this.data = null;
		this.scene.draggingObject = null;
		this.scene.hitCheck(this);
		this.scene.checkClear();
	}

	checkClear() {
		for (var i = 0; i < this.pieces.length; ++i) {
			if (!this.pieces[i].set) {
				return false;
			}
		}
		window.alert("Game Clear!!");
	}

	hitCheck(content) {
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
			var bw = this.pieceFrame[i].width / 8;
			var bh = this.pieceFrame[i].height / 8;

			brect.x = this.pieceFrame[i].position.x + (this.pieceFrame[i].width / 2);
			brect.y = this.pieceFrame[i].position.y + (this.pieceFrame[i].height / 2);
			brect.width = bw;
			brect.height = bh;
			if (isHit(arect, brect)) {
				if (content.pieceNumber == i) {
					content.set = true;
					content.position.x = this.pieceFrame[i].position.x;
					content.position.y = this.pieceFrame[i].position.y;
				}
			}
		}
	}

	onDragMove() {
		if (this.dragging) {
			var newPosition = this.data.getLocalPosition(this.parent);
			this.position.x = this.distance.x + newPosition.x;
			this.position.y = this.distance.y + newPosition.y;
		}
	}

	update() {

	}

	createPieceMask(topTab, rightTab, bottomTab, leftTab, tileWidth, fill) {
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