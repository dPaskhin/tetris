import {
  CODE_DOWN,
  CODE_LEFT,
  CODE_RIGHT,
  CODE_SPACE,
  CODE_UP,
} from 'keycode-js';

import { Shape } from '@src/Shape/Shape';
import { ResultField } from '@src/ResultField/ResultField';
import { Side } from '@src/Common/enums/Side';
import { Direction } from '@src/Common/enums/Direction';
import { ShapeMoveLimitationService } from '@src/Common/services/ShapeMoveLimitationService';
import { ICoords } from '@src/Common/interfaces/ICoords';
import { MainCanvas } from '@src/Canvas/MainCanvas';
import { ShapeCollisionResolveService } from '@src/Common/services/ShapeCollisionResolveService';
import { IAnyFunction } from '@src/Common/interfaces/IAnyFunction';

export class KeyControls {
  private readonly canvasBarriersCoords: ICoords;

  constructor(
    private readonly shape: Shape,
    private readonly resultField: ResultField,
    private readonly canvas: MainCanvas,
    private readonly onAnyKeyPress: IAnyFunction,
    private readonly shapeMoveLimitationService: ShapeMoveLimitationService,
    private readonly shapeCollisionResolveService: ShapeCollisionResolveService,
  ) {
    this.controlsHandler();
    this.canvasBarriersCoords = {
      x: this.canvas.blocksCountHorizontal - 1,
      y: this.canvas.blocksCountVertical - 1,
    };
  }

  private onKeyUp(): void {
    this.shape.rotate();

    if (
      this.shapeMoveLimitationService.isShapeCollision(
        this.shape,
        this.resultField,
        this.canvasBarriersCoords,
      )
    ) {
      this.shapeCollisionResolveService.shapeRealise(
        this.shape,
        this.resultField,
        this.canvasBarriersCoords,
      );
    }
  }

  private onKeySpace(): void {
    while (
      !this.shapeMoveLimitationService
        .getLimitationSides(
          this.shape,
          this.resultField,
          this.canvasBarriersCoords,
        )
        .has(Side.BOTTOM)
    ) {
      this.shape.moveDown();
    }
  }

  public controlsHandler(): void {
    window.addEventListener('keydown', ({ code }) => {
      const shapeMoveLimitations = this.shapeMoveLimitationService.getLimitationSides(
        this.shape,
        this.resultField,
        this.canvasBarriersCoords,
      );

      if (code === CODE_UP) {
        this.onKeyUp();
        this.onAnyKeyPress();
      }

      if (code === CODE_DOWN && !shapeMoveLimitations.has(Side.BOTTOM)) {
        this.shape.moveDown();
        this.onAnyKeyPress();
      }

      if (code === CODE_LEFT && !shapeMoveLimitations.has(Side.LEFT)) {
        this.shape.moveDirection(Direction.LEFT);
        this.onAnyKeyPress();
      }

      if (code === CODE_RIGHT && !shapeMoveLimitations.has(Side.RIGHT)) {
        this.shape.moveDirection(Direction.RIGHT);
        this.onAnyKeyPress();
      }

      if (code === CODE_SPACE) {
        this.onKeySpace();
      }
    });
  }
}
