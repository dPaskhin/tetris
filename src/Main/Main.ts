import { injectable } from 'inversify';
import { CODE_DOWN, CODE_LEFT, CODE_RIGHT, CODE_UP } from 'keycode-js';

import { ShapeFactory } from '@src/Shape/services/ShapeFactory';
import { ShapeType } from '@src/Shape/enums/ShapeType';
import { Shape } from '@src/Shape/Shape';
import { CanvasFactory } from '@src/Canvas/services/CanvasFactory';
import { DrawingCanvas } from '@src/Canvas/DrawingCanvas';
import { AnimationService } from '@src/Main/services/AnimationService';
import { ResultFieldFactory } from '@src/ResultField/services/ResultFieldFactory';
import { ResultField } from '@src/ResultField/ResultField';
import { ShapeMoveLimitationService } from '@src/Main/services/ShapeMoveLimitationService';
import { Direction } from '@src/Common/enums/Direction';
import { Side } from '@src/Common/enums/Side';
import { ShapeCollisionResolveService } from '@src/Main/services/ShapeCollisionResolveService';
import { ResultFieldCheckFullService } from '@src/Main/services/ResultFieldCheckFullService';
import { GridCanvas } from '@src/Canvas/GridCanvas';
import { ICoords } from '@src/Common/interfaces/ICoords';

@injectable()
export class Main {
  private readonly resultField: ResultField;

  private readonly drawingCanvas: DrawingCanvas;

  private readonly gridCanvas: GridCanvas;

  private readonly shape: Shape;

  private readonly drawingCanvasBarriersCoords: ICoords;

  constructor(
    private readonly canvasFactory: CanvasFactory,
    private readonly shapeFactory: ShapeFactory,
    private readonly animationService: AnimationService,
    private readonly resultFieldFactory: ResultFieldFactory,
    private readonly shapeMoveLimitationService: ShapeMoveLimitationService,
    private readonly shapeCollisionResolveService: ShapeCollisionResolveService,
    private readonly resultFieldUpdateService: ResultFieldCheckFullService,
  ) {
    this.resultField = resultFieldFactory.create();
    this.drawingCanvas = canvasFactory.createDrawingCanvas();
    this.gridCanvas = canvasFactory.createGridCanvas();
    this.shape = shapeFactory.create(ShapeType.STICK);

    this.gridCanvas.drawGrid();

    this.drawingCanvasBarriersCoords = {
      x: this.drawingCanvas.blocksCountHorizontal - 1,
      y: this.drawingCanvas.blocksCountVertical - 1,
    };

    this.shape.moveToCoords({
      x: this.drawingCanvas.blocksCountHorizontal / 2 - this.shape.size / 2,
      y: 0,
    });

    this.controlsHandler();

    this.animationService.animate(
      () => this.onAnimatePerFrame(),
      () => this.onAnimatePerSecond(),
    );
  }

  private controlsHandler(): void {
    window.addEventListener('keydown', (e) => {
      const shapeMoveLimitations = this.shapeMoveLimitationService.getLimitationSides(
        this.shape,
        this.resultField,
        this.drawingCanvasBarriersCoords,
      );

      if (e.code === CODE_UP) {
        this.shape.rotate();

        if (
          this.shapeMoveLimitationService.isShapeCollision(
            this.shape,
            this.resultField,
            this.drawingCanvasBarriersCoords,
          )
        ) {
          this.shapeCollisionResolveService.shapeRealise(
            this.shape,
            this.resultField,
            this.drawingCanvasBarriersCoords,
          );
        }
      }

      if (e.code === CODE_DOWN && !shapeMoveLimitations.has(Side.BOTTOM)) {
        this.shape.moveDown();
      }

      if (e.code === CODE_LEFT && !shapeMoveLimitations.has(Side.LEFT)) {
        this.shape.moveDirection(Direction.LEFT);
      }

      if (e.code === CODE_RIGHT && !shapeMoveLimitations.has(Side.RIGHT)) {
        this.shape.moveDirection(Direction.RIGHT);
      }
    });
  }

  private onAnimatePerFrame(): void {
    this.drawingCanvas.clear();
    this.drawingCanvas.drawBlocks(
      [
        ...this.shape.blockMatrix.flat(),
        ...this.resultField.blockMatrix.flat(),
      ].filter((block) => block.isFilled),
    );
  }

  private onAnimatePerSecond(): void {
    const shapeMoveLimitations = this.shapeMoveLimitationService.getLimitationSides(
      this.shape,
      this.resultField,
      this.drawingCanvasBarriersCoords,
    );

    if (shapeMoveLimitations.has(Side.BOTTOM)) {
      this.resultField.addShape(this.shape);

      const resultFieldFullRows = this.resultFieldUpdateService.getFullRows(
        this.resultField,
        this.drawingCanvas.blocksCountHorizontal,
      );

      if (resultFieldFullRows.length > 0) {
        this.resultField.deleteRows(resultFieldFullRows);
      }

      this.shape.mutate();
      this.shape.moveToCoords({ x: 8, y: 0 });
    }

    this.shape.moveDown();
  }
}
