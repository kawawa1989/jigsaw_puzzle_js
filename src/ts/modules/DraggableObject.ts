export interface OnDragStartDelegate {
	(obj: DraggableObject): void;
}

export interface OnDragEndDelegate {
	(obj: DraggableObject): void;
}

export class DraggableObject extends PIXI.Container {
	static draggingObject: DraggableObject = null;
	public data: any;
	public distance: PIXI.Point;
	public dragEnable = true;
	public onDragStartEvent: OnDragStartDelegate = null;
	public onDragEndEvent: OnDragEndDelegate = null;
	public dragging: boolean = false;

	constructor() {
		super();
		// ドラッグを開始
		this.on('mousedown', this.onDragStart);
		this.on('touchstart', this.onDragStart);
		// ドロップ（ドラッグを終了）
		this.on('mouseup', this.onDragEnd);
		this.on('mouseupoutside', this.onDragEnd);
		this.on('touchend', this.onDragEnd);
		this.on('touchendoutside', this.onDragEnd);
		// ドラッグ中
		this.on('mousemove', this.onDragMove);
		this.on('touchmove', this.onDragMove);
	}

	onDragStart(event): void {
		if (DraggableObject.draggingObject != null) {
			return;
		}
		if (!this.dragEnable) {
			return;
		}
		if (this.onDragStartEvent != null) {
			this.onDragStartEvent(this);
		}
		DraggableObject.draggingObject = this;

		var pos = event.data.getLocalPosition(this.parent);
		this.distance = new PIXI.Point(0, 0);
		this.distance.x = this.position.x - pos.x;
		this.distance.y = this.position.y - pos.y;

		// store a reference to the data
		// the reason for this is because of multitouch
		// we want to track the movement of this particular touch
		this.data = event.data;
		this.alpha = 0.5;
		this.dragging = true;
	}

	onDragEnd(): void {
		DraggableObject.draggingObject = null;
		this.alpha = 1;
		this.dragging = false;
		// set the interaction data to null
		this.data = null;
		if (this.onDragEndEvent != null) {
			this.onDragEndEvent(this);
		}
	}

	onDragMove(): void {
		if (this.dragging) {
			var newPosition = this.data.getLocalPosition(this.parent);
			this.position.x = this.distance.x + newPosition.x;
			this.position.y = this.distance.y + newPosition.y;
		}
	}
}