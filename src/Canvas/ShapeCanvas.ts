import { BaseCanvas } from '@src/Canvas/BaseCanvas';
import { CanvasId } from '@src/Canvas/enums/CanvasId';
import { ShapeCanvasSize } from '@src/Canvas/enums/ShapeCanvasSize';

export class ShapeCanvas extends BaseCanvas {
  constructor() {
    super(CanvasId.SHAPE, ShapeCanvasSize.WIDTH, ShapeCanvasSize.HEIGHT);
  }
}
