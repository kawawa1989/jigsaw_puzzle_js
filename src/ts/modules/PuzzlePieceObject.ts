import { DraggableObject } from './DraggableObject';

export class PuzzlePieceObject extends DraggableObject {
	public pieceNumber: number;

	constructor(pieceNumber: number) {
		super();
		this.pieceNumber = pieceNumber;
	}
}