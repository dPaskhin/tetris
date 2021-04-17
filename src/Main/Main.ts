import { injectable } from 'inversify';
import { CODE_DOWN, CODE_LEFT, CODE_RIGHT, CODE_UP } from 'keycode-js';

import { ShapeFactory } from '@src/Shape/services/ShapeFactory';
import { ShapeType } from '@src/Shape/enums/ShapeType';
import { Shape } from '@src/Shape/Shape';
import { CanvasFactory } from '@src/Canvas/services/CanvasFactory';
import { MainCanvas } from '@src/Canvas/MainCanvas';
import { ResultFieldFactory } from '@src/ResultField/services/ResultFieldFactory';
import { ResultField } from '@src/ResultField/ResultField';
import { ShapeMoveLimitationService } from '@src/Main/services/ShapeMoveLimitationService';
import { Direction } from '@src/Common/enums/Direction';
import { Side } from '@src/Common/enums/Side';
import { ShapeCollisionResolveService } from '@src/Main/services/ShapeCollisionResolveService';
import { ResultFieldCheckFullService } from '@src/Main/services/ResultFieldCheckFullService';
import { GridCanvas } from '@src/Canvas/GridCanvas';
import { ICoords } from '@src/Common/interfaces/ICoords';
import { ShapeCanvas } from '@src/Canvas/ShapeCanvas';
import { CanvasId } from '@src/Canvas/enums/CanvasId';
import { MainCanvasSize } from '@src/Canvas/enums/MainCanvasSize';
import { ShapeCanvasSize } from '@src/Canvas/enums/ShapeCanvasSize';
import { CommonService } from '@src/Common/services/CommonService';
import { TimerFactory } from '@src/Timer/services/TimerFactory';
import { Timer } from '@src/Timer/Timer';
import { AnimationFactory } from '@src/Animation/services/AnimationFactory';
import { Animation } from '@src/Animation/Animation';

@injectable()
export class Main {
  private readonly animation: Animation;

  private readonly resultField: ResultField;

  private readonly mainCanvas: MainCanvas;

  private readonly shapeCanvas: ShapeCanvas;

  private readonly mainGridCanvas: GridCanvas;

  private readonly shapeGridCanvas: GridCanvas;

  private readonly mainShape: Shape;

  private readonly futureShape: Shape;

  private readonly mainCanvasBarriersCoords: ICoords;

  private readonly mainShapeBottomContactTimer: Timer;

  private futureShapeType: ShapeType;

  private isMainShapeBottomContact: boolean;

  constructor(
    private readonly canvasFactory: CanvasFactory,
    private readonly shapeFactory: ShapeFactory,
    private readonly resultFieldFactory: ResultFieldFactory,
    private readonly shapeMoveLimitationService: ShapeMoveLimitationService,
    private readonly shapeCollisionResolveService: ShapeCollisionResolveService,
    private readonly resultFieldUpdateService: ResultFieldCheckFullService,
    private readonly commonService: CommonService,
    private readonly timerFactory: TimerFactory,
    private readonly animationFactory: AnimationFactory,
  ) {
    this.animation = animationFactory.create();
    this.resultField = resultFieldFactory.create();
    this.mainCanvas = canvasFactory.createMainCanvas();
    this.mainGridCanvas = canvasFactory.createGridCanvas(
      CanvasId.MAIN_GRID,
      MainCanvasSize.WIDTH,
      MainCanvasSize.HEIGHT,
    );
    this.shapeGridCanvas = canvasFactory.createGridCanvas(
      CanvasId.SHAPE_GRID,
      ShapeCanvasSize.WIDTH,
      ShapeCanvasSize.HEIGHT,
    );
    this.shapeCanvas = canvasFactory.createShapeCanvas();

    const randomShapeType = this.commonService.getRandomShapeType();
    const futureRandomShapeType = this.commonService.getRandomShapeType();

    this.mainShape = shapeFactory.create(randomShapeType);
    this.futureShapeType = futureRandomShapeType;
    this.futureShape = shapeFactory.create(futureRandomShapeType);

    this.futureShape.moveToCoords({
      x: 1,
      y: 1,
    });

    this.shapeCanvas.drawBlocks(this.futureShape.blockMatrix.flat());

    this.mainGridCanvas.drawGrid();
    this.shapeGridCanvas.drawGrid();

    this.mainCanvasBarriersCoords = {
      x: this.mainCanvas.blocksCountHorizontal - 1,
      y: this.mainCanvas.blocksCountVertical - 1,
    };

    this.mainShape.moveToCoords({
      x: this.mainCanvas.blocksCountHorizontal / 2 - 2,
      y: 0,
    });

    this.controlsHandler();

    this.animation.animate(
      () => this.onAnimatePerFrame(),
      () => this.onAnimatePerSecond(),
    );

    this.mainShapeBottomContactTimer = this.timerFactory.create();
    this.isMainShapeBottomContact = false;
  }

  private controlsHandler(): void {
    window.addEventListener('keydown', (e) => {
      this.isMainShapeBottomContact = false;
      this.mainShapeBottomContactTimer.stop();

      const shapeMoveLimitations = this.shapeMoveLimitationService.getLimitationSides(
        this.mainShape,
        this.resultField,
        this.mainCanvasBarriersCoords,
      );

      if (e.code === CODE_UP) {
        this.mainShape.rotate();

        if (
          this.shapeMoveLimitationService.isShapeCollision(
            this.mainShape,
            this.resultField,
            this.mainCanvasBarriersCoords,
          )
        ) {
          this.shapeCollisionResolveService.shapeRealise(
            this.mainShape,
            this.resultField,
            this.mainCanvasBarriersCoords,
          );
        }
      }

      if (e.code === CODE_DOWN && !shapeMoveLimitations.has(Side.BOTTOM)) {
        this.mainShape.moveDown();
      }

      if (e.code === CODE_LEFT && !shapeMoveLimitations.has(Side.LEFT)) {
        this.mainShape.moveDirection(Direction.LEFT);
      }

      if (e.code === CODE_RIGHT && !shapeMoveLimitations.has(Side.RIGHT)) {
        this.mainShape.moveDirection(Direction.RIGHT);
      }
    });
  }

  private onAnimatePerFrame(): void {
    const shapeMoveLimitations = this.shapeMoveLimitationService.getLimitationSides(
      this.mainShape,
      this.resultField,
      this.mainCanvasBarriersCoords,
    );

    this.mainCanvas.clear();
    this.mainCanvas.drawBlocks(
      [
        ...this.mainShape.blockMatrix.flat(),
        ...this.resultField.blockMatrix.flat(),
      ].filter((block) => block.isFilled),
    );

    if (
      shapeMoveLimitations.has(Side.BOTTOM) &&
      !this.isMainShapeBottomContact
    ) {
      this.isMainShapeBottomContact = true;

      this.mainShapeBottomContactTimer.start(() => {
        this.resultField.addShape(this.mainShape);

        const resultFieldFullRows = this.resultFieldUpdateService.getFullRows(
          this.resultField,
          this.mainCanvas.blocksCountHorizontal,
        );

        if (resultFieldFullRows.length > 0) {
          this.resultField.deleteRows(resultFieldFullRows);
        }

        this.shapeUpdate();
      }, 500);
    }
  }

  private endGame(): void {
    this.animation.stop();
    alert('Game over');
  }

  private shapeUpdate(): void {
    const randomShapeType = this.commonService.getRandomShapeType();

    this.mainShape.update(this.futureShapeType);

    this.mainShape.moveToCoords({
      x: this.mainCanvas.blocksCountHorizontal / 2 - 2,
      y: 0,
    });

    if (
      this.shapeMoveLimitationService.isShapeCollision(
        this.mainShape,
        this.resultField,
        this.mainCanvasBarriersCoords,
      )
    ) {
      this.endGame();

      return;
    }

    this.futureShapeType = randomShapeType;
    this.futureShape.update(randomShapeType);
    this.futureShape.moveToCoords({
      x: 1,
      y: 1,
    });
    this.shapeCanvas.clear();
    this.shapeCanvas.drawBlocks(this.futureShape.blockMatrix.flat());
    this.isMainShapeBottomContact = false;
  }

  private onAnimatePerSecond(): void {
    const shapeMoveLimitations = this.shapeMoveLimitationService.getLimitationSides(
      this.mainShape,
      this.resultField,
      this.mainCanvasBarriersCoords,
    );

    if (!shapeMoveLimitations.has(Side.BOTTOM)) {
      this.mainShape.moveDown();
    }
  }
}
