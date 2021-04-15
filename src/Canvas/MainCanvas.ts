import { CanvasId } from '@src/Canvas/enums/CanvasId';
import { MainCanvasSize } from '@src/Canvas/enums/MainCanvasSize';
import { DrawingCanvas } from '@src/Canvas/DrawingCanvas';

export class MainCanvas extends DrawingCanvas {
  constructor() {
    super(CanvasId.MAIN, MainCanvasSize.WIDTH, MainCanvasSize.HEIGHT);
  }
}
