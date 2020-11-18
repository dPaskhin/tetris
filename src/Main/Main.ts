import { ShapeFactory } from '@src/Shape/services/ShapeFactory';
import { ShapeTypes } from '@src/Shape/enums/ShapeTypes';
import { CanvasService } from '@src/Canvas/services/CanvasService';
import { Shape } from '@src/Shape/Shape';
import { CanvasFactory } from '@src/Canvas/services/CanvasFactory';
import { Canvas } from '@src/Canvas/Canvas';
import { AnimationService } from '@src/Main/services/AnimationService';
import { CODE_DOWN, CODE_LEFT, CODE_RIGHT, CODE_UP } from 'keycode-js';
import { MoveSidesDirections } from '@src/Shape/enums/MoveSidesDirections';
import { BarrierTypes } from '@src/Shape/enums/BarrierTypes';

export class Main {
  private readonly animationService: AnimationService;

  constructor(
    private readonly canvasFactory: CanvasFactory,
    private readonly shapeFactory: ShapeFactory,
  ) {
    this.animationService = new AnimationService();
  }

  private static controlsHandler(shape: Shape) {
    window.addEventListener('keydown', e => {
      if (e.code === CODE_UP) {
        shape.rotate();
      }

      if (e.code === CODE_DOWN && !shape.checkBarriers(BarrierTypes.BOTTOM)) {
        shape.moveDown();
      }

      if (e.code === CODE_LEFT && !shape.checkBarriers(BarrierTypes.LEFT)) {
        shape.moveSides(MoveSidesDirections.LEFT);
      }

      if (e.code === CODE_RIGHT && !shape.checkBarriers(BarrierTypes.RIGHT)) {
        shape.moveSides(MoveSidesDirections.RIGHT);
      }
    });
  }

  private static canvasSetup(canvas: Canvas) {
    CanvasService.setCanvasSize(canvas.$canvas);
  }

  private static shapeSetup(shape: Shape) {
    shape.moveToCoords({ x: 8, y: 0 });
  }

  private static onAnimateStep(ctx: CanvasRenderingContext2D, shape: Shape) {
    CanvasService.clear(ctx);
    CanvasService.drawShape(shape, ctx);
  }

  private static onAnimatePerSecondStep(shape: Shape) {
    if (shape.checkBarriers(BarrierTypes.BOTTOM)) {
      return;
    }

    shape.moveDown();
  }

  public execute() {
    const shape = this.shapeFactory.create(ShapeTypes.T_SHAPE);
    const canvas = this.canvasFactory.create();

    if (!shape || !canvas) {
      return;
    }

    Main.canvasSetup(canvas);
    Main.shapeSetup(shape);
    Main.controlsHandler(shape);

    this.animationService.animate(
      () => Main.onAnimateStep(canvas.ctx, shape),
      () => Main.onAnimatePerSecondStep(shape),
    );
  }
}
