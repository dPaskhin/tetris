import { CanvasId } from '@src/Canvas/enums/CanvasId';
import { ShapeCanvasSize } from '@src/Canvas/enums/ShapeCanvasSize';
import { DrawingCanvas } from '@src/Canvas/DrawingCanvas';

export class ShapeCanvas extends DrawingCanvas {
  constructor() {
    super(CanvasId.SHAPE, ShapeCanvasSize.WIDTH, ShapeCanvasSize.HEIGHT);
  }
}
