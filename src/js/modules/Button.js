import * as PIXI from 'pixi.js';

export default class extends PIXI.Sprite{
	constructor(texture) {
		super(texture);

		this.onClick = null;
		this.deltaTime = 0;
		this.state = 0;

		this.interactive = true;

		this.on('mousedown', this.touchDown);
		this.on('touchstart', this.touchDown);
		this.on('mouseup', this.touchUp);
		this.on('touchend', this.touchUp);

		this.on('mouseupoutside', this.cancel);
		this.on('touchendoutside', this.cancel);
	}

	cancel() {
		this.state = 0;
		this.alpha = 1;		
	}

	touchDown() {
		console.log("touchDown");
		this.state = 1;
		this.alpha = 0.5;
	}

	touchUp() {
		console.log("touchUp");
		this.alpha = 1;
		if (this.state == 1) {
			this.state = 0;
			if (this.onClick != null) {
				this.onClick();
			}
		}
	}
}