import { injectable } from 'inversify';

import { DrawingCanvas } from '@src/Canvas/DrawingCanvas';
import { GridCanvas } from '@src/Canvas/GridCanvas';

@injectable()
export class CanvasFactory {
  public createDrawingCanvas(width: number, height: number): DrawingCanvas {
    return new DrawingCanvas(width, height);
  }

  public createGridCanvas(width: number, height: number): GridCanvas {
    return new GridCanvas(width, height);
  }
}
