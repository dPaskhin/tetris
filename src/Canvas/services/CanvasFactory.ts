import { injectable } from 'inversify';

import { DrawingCanvas } from '@src/Canvas/DrawingCanvas';
import { GridCanvas } from '@src/Canvas/GridCanvas';

@injectable()
export class CanvasFactory {
  public createDrawingCanvas(): DrawingCanvas {
    return new DrawingCanvas();
  }

  public createGridCanvas(): GridCanvas {
    return new GridCanvas();
  }
}
