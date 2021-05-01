import { injectable } from 'inversify';

import { ShapeFactory } from '@src/Shape/services/ShapeFactory';
import { Shape } from '@src/Shape/Shape';
import { CanvasFactory } from '@src/Canvas/services/CanvasFactory';
import { MainCanvas } from '@src/Canvas/MainCanvas';
import { ResultFieldFactory } from '@src/ResultField/services/ResultFieldFactory';
import { ResultField } from '@src/ResultField/ResultField';
import { ShapeMoveLimitationService } from '@src/Common/services/ShapeMoveLimitationService';
import { Side } from '@src/Common/enums/Side';
import { ShapeCollisionResolveService } from '@src/Common/services/ShapeCollisionResolveService';
import { ResultFieldCheckFullService } from '@src/Main/services/ResultFieldCheckFullService';
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
import { ScoreFactory } from '@src/Score/services/ScoreFactory';
import { Score } from '@src/Score/Score';
import { KeyControlsFactory } from '@src/KeyControls/services/KeyControlsFactory';
import { ShapeHandler } from '@src/ShapeHandler/ShapeHandler';
import { ShapeHandlerFactory } from '@src/ShapeHandler/services/ShapeHandlerFactory';

@injectable()
export class Main {
  private readonly mainCanvas: MainCanvas;

  private readonly shapeCanvas: ShapeCanvas;

  private readonly animation: Animation;

  private readonly shapeHandler: ShapeHandler;

  private readonly mainShape: Shape;

  private readonly futureShape: Shape;

  private readonly resultField: ResultField;

  private readonly score: Score;

  private readonly mainCanvasBarriersCoords: ICoords;

  private readonly mainShapeBottomContactTimer: Timer;

  constructor(
    private readonly canvasFactory: CanvasFactory,
    private readonly shapeFactory: ShapeFactory,
    private readonly resultFieldFactory: ResultFieldFactory,
    private readonly shapeMoveLimitationService: ShapeMoveLimitationService,
    private readonly shapeCollisionResolveService: ShapeCollisionResolveService,
    private readonly resultFieldCheckFullService: ResultFieldCheckFullService,
    private readonly commonService: CommonService,
    private readonly timerFactory: TimerFactory,
    private readonly animationFactory: AnimationFactory,
    private readonly scoreFactory: ScoreFactory,
    private readonly keyControlsFactory: KeyControlsFactory,
    private readonly shapeHandlerFactory: ShapeHandlerFactory,
  ) {
    this.mainCanvas = canvasFactory.createMainCanvas();
    canvasFactory
      .createGridCanvas(
        CanvasId.MAIN_GRID,
        MainCanvasSize.WIDTH,
        MainCanvasSize.HEIGHT,
      )
      .drawGrid();

    this.shapeCanvas = canvasFactory.createShapeCanvas();
    canvasFactory
      .createGridCanvas(
        CanvasId.SHAPE_GRID,
        ShapeCanvasSize.WIDTH,
        ShapeCanvasSize.HEIGHT,
      )
      .drawGrid();

    this.shapeHandler = this.shapeHandlerFactory.create(this.mainCanvas);
    this.mainShape = this.shapeHandler.mainShape;
    this.futureShape = this.shapeHandler.futureShape;
    this.resultField = resultFieldFactory.create();
    this.score = scoreFactory.create();

    this.mainCanvasBarriersCoords = {
      x: this.mainCanvas.blocksCountHorizontal - 1,
      y: this.mainCanvas.blocksCountVertical - 1,
    };

    this.mainShapeBottomContactTimer = this.timerFactory.create(
      this.afterShapeBottomContact.bind(this),
      500,
    );

    this.animation = animationFactory.create(
      this.onAnimatePerFrame.bind(this),
      this.onAnimatePerStep.bind(this),
    );

    this.keyControlsFactory
      .create({
        shape: this.mainShape,
        resultField: this.resultField,
        canvas: this.mainCanvas,
        animation: this.animation,
      })
      .controlsHandler({
        onAnyKey: this.preventShapeBottomContact.bind(this),
        onSpace: this.afterShapeBottomContact.bind(this),
      });
  }

  private drawBlocks(): void {
    this.mainCanvas.clear();
    this.shapeCanvas.clear();
    this.mainCanvas.drawBlocks(
      [
        ...this.mainShape.blockMatrix.flat(),
        ...this.resultField.blockMatrix.flat(),
      ].filter((block) => block.isFilled),
    );
    this.shapeCanvas.drawBlocks(
      this.futureShape.blockMatrix.flat().filter((block) => block.isFilled),
    );
  }

  private endGame(): void {
    this.animation.stop();
    // eslint-disable-next-line no-alert
    if (window.confirm('Game over. Another one?')) {
      this.resultField.reset();
      this.score.reset();
      this.shapeHandler.shapeUpdate();
      this.animation.updateStepTime(1);
      this.animation.resume();
    }
  }

  private deleteResultFieldFullRows(): void {
    const resultFieldFullRowIds = this.resultFieldCheckFullService.getFullRows(
      this.resultField,
      this.mainCanvas.blocksCountHorizontal,
    );

    if (resultFieldFullRowIds.length === 0) {
      return;
    }

    this.resultField.deleteRows(resultFieldFullRowIds);
    this.score.addLines(resultFieldFullRowIds.length);
    this.animation.updateStepTime(this.score.level);
  }

  private onAnimatePerFrame(): void {
    const shapeMoveLimitations = this.shapeMoveLimitationService.getLimitationSides(
      this.mainShape,
      this.resultField,
      this.mainCanvasBarriersCoords,
    );

    this.drawBlocks();

    if (
      shapeMoveLimitations.has(Side.BOTTOM) &&
      !this.mainShapeBottomContactTimer.isContinue
    ) {
      this.mainShapeBottomContactTimer.start();
    }
  }

  private onAnimatePerStep(): void {
    const shapeMoveLimitations = this.shapeMoveLimitationService.getLimitationSides(
      this.mainShape,
      this.resultField,
      this.mainCanvasBarriersCoords,
    );

    if (!shapeMoveLimitations.has(Side.BOTTOM)) {
      this.mainShape.moveDown();
    }
  }

  private afterShapeBottomContact(): void {
    this.resultField.addShape(this.mainShape);
    this.deleteResultFieldFullRows();
    this.shapeHandler.shapeUpdate();
    this.mainShapeBottomContactTimer.stop();

    if (
      this.shapeMoveLimitationService.isShapeCollision(
        this.mainShape,
        this.resultField,
        this.mainCanvasBarriersCoords,
      )
    ) {
      this.endGame();
    }
  }

  private preventShapeBottomContact(): void {
    if (!this.mainShapeBottomContactTimer.isContinue) {
      return;
    }

    if (
      !this.shapeMoveLimitationService
        .getLimitationSides(
          this.mainShape,
          this.resultField,
          this.mainCanvasBarriersCoords,
        )
        .has(Side.BOTTOM)
    ) {
      this.mainShapeBottomContactTimer.stop();

      return;
    }

    this.mainShapeBottomContactTimer.restart();
  }
}
