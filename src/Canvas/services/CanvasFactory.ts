import { injectable } from 'inversify';

import { MainCanvas } from '@src/Canvas/MainCanvas';
import { GridCanvas } from '@src/Canvas/GridCanvas';
import { ShapeCanvas } from '@src/Canvas/ShapeCanvas';
import { CanvasId } from '@src/Canvas/enums/CanvasId';

@injectable()
export class CanvasFactory {
  public createMainCanvas(): MainCanvas {
    return new MainCanvas();
  }

  public createShapeCanvas(): ShapeCanvas {
    return new ShapeCanvas();
  }

  public createGridCanvas(
    id: CanvasId,
    width: number,
    height: number,
  ): GridCanvas {
    return new GridCanvas(id, width, height);
  }
}
