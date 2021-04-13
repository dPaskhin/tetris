import { injectable } from 'inversify';

import { DrawingCanvas } from '@src/Canvas/DrawingCanvas';
import { GridCanvas } from '@src/Canvas/GridCanvas';
import { ShapeCanvas } from '@src/Canvas/ShapeCanvas';
import { CanvasId } from '@src/Canvas/enums/CanvasId';

@injectable()
export class CanvasFactory {
  public createDrawingCanvas(): DrawingCanvas {
    return new DrawingCanvas();
  }

  public createGridCanvas(
    id: CanvasId,
    width: number,
    height: number,
  ): GridCanvas {
    return new GridCanvas(id, width, height);
  }

  public createShapeCanvas(): ShapeCanvas {
    return new ShapeCanvas();
  }
}
