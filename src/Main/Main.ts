import { injectable } from 'inversify';

import { ShapeFactory } from '@src/Shape/services/ShapeFactory';
import { ShapeType } from '@src/Shape/enums/ShapeType';
import { Shape } from '@src/Shape/Shape';
import { CanvasFactory } from '@src/Canvas/services/CanvasFactory';
import { MainCanvas } from '@src/Canvas/MainCanvas';
import { ResultFieldFactory } from '@src/ResultField/services/ResultFieldFactory';
import { ResultField } from '@src/ResultField/ResultField';
import { ShapeMoveLimitationService } from '@src/Common/services/ShapeMoveLimitationService';
import { Side } from '@src/Common/enums/Side';
import { ShapeCollisionResolveService } from '@src/Common/services/ShapeCollisionResolveService';
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
import { ScoreFactory } from '@src/Score/services/ScoreFactory';
import { Score } from '@src/Score/Score';
import { KeyControlsFactory } from '@src/KeyControls/services/KeyControlsFactory';

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

  private readonly score: Score;

  private futureShapeType: ShapeType;

  private futureShapeColor: string;

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
    private readonly scoreFactory: ScoreFactory,
    private readonly keyControlsFactory: KeyControlsFactory,
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
    this.score = scoreFactory.create();

    const randomShapeType = this.commonService.getRandomShapeType();
    const randomShapeColor = this.commonService.getRandomColor();
    const futureRandomShapeType = this.commonService.getRandomShapeType();
    const futureRandomShapeColor = this.commonService.getRandomColor();

    this.mainShape = shapeFactory.create(randomShapeType, randomShapeColor);
    this.futureShapeType = futureRandomShapeType;
    this.futureShapeColor = futureRandomShapeColor;
    this.futureShape = shapeFactory.create(
      futureRandomShapeType,
      futureRandomShapeColor,
    );

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

    this.keyControlsFactory.create({
      shape: this.mainShape,
      resultField: this.resultField,
      canvas: this.mainCanvas,
      onAnyKeyPress: () => {
        this.isMainShapeBottomContact = false;
        this.mainShapeBottomContactTimer.stop();
      },
    });

    this.animation.animate(
      () => this.onAnimatePerFrame(),
      () => this.onAnimatePerStep(),
    );

    this.mainShapeBottomContactTimer = this.timerFactory.create();
    this.isMainShapeBottomContact = false;
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
          this.deleteResultFieldFullRows(resultFieldFullRows);
        }

        this.shapeUpdate();
      }, 500);
    }
  }

  private endGame(): void {
    this.animation.stop();
    alert('Game over');
  }

  private deleteResultFieldFullRows(rowIds: number[]): void {
    this.resultField.deleteRows(rowIds);
    this.score.addLines(rowIds.length);
    this.animation.updateStepTime(this.score.level);
  }

  private shapeUpdate(): void {
    const randomShapeType = this.commonService.getRandomShapeType();
    const randomShapeColor = this.commonService.getRandomColor();

    this.mainShape.update(this.futureShapeType, this.futureShapeColor);

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
    this.futureShapeColor = randomShapeColor;
    this.futureShape.update(randomShapeType, randomShapeColor);
    this.futureShape.moveToCoords({
      x: 1,
      y: 1,
    });
    this.shapeCanvas.clear();
    this.shapeCanvas.drawBlocks(this.futureShape.blockMatrix.flat());
    this.isMainShapeBottomContact = false;
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
}
