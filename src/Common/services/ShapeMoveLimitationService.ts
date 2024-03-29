import { injectable } from 'inversify';

import { Shape } from '@src/Shape/Shape';
import { ResultField } from '@src/ResultField/ResultField';
import { ShapeFactory } from '@src/Shape/services/ShapeFactory';
import { Direction } from '@src/Common/enums/Direction';
import { Side } from '@src/Common/enums/Side';
import { IShapeMoveLimitationSides } from '@src/Main/types/IShapeMoveLimitationSides';
import { ICoords } from '@src/Common/interfaces/ICoords';

@injectable()
export class ShapeMoveLimitationService {
  constructor(private readonly shapeFactory: ShapeFactory) {}

  private getTouchedBarrierSides(
    shape: Shape,
    barriersCoords: ICoords,
  ): Set<IShapeMoveLimitationSides> {
    return new Set<IShapeMoveLimitationSides>(
      shape.blockMatrix.reduce<IShapeMoveLimitationSides[]>(
        (acc, row) => [
          ...acc,
          ...row.flatMap((block) => {
            const sides: IShapeMoveLimitationSides[] = [];

            if (!block.isFilled) {
              return sides;
            }

            if (block.coords.x <= 0) {
              sides.push(Side.LEFT);
            }

            if (block.coords.x >= barriersCoords.x) {
              sides.push(Side.RIGHT);
            }

            if (block.coords.y >= barriersCoords.y) {
              sides.push(Side.BOTTOM);
            }

            return sides;
          }),
        ],
        [],
      ),
    );
  }

  private getTouchedResultFieldSides(
    shape: Shape,
    resultField: ResultField,
  ): Set<IShapeMoveLimitationSides> {
    return new Set(
      shape.blockMatrix.reduce<IShapeMoveLimitationSides[]>(
        (acc, row) => [
          ...acc,
          ...row.flatMap((block) => {
            const sides: IShapeMoveLimitationSides[] = [];

            if (!block.isFilled) {
              return sides;
            }

            if (
              resultField.blockMatrix
                .flat()
                .some(
                  (resultFieldBlock) =>
                    resultFieldBlock.coords.x - block.coords.x === 1 &&
                    block.coords.y === resultFieldBlock.coords.y,
                )
            ) {
              sides.push(Side.RIGHT);
            }

            if (
              resultField.blockMatrix
                .flat()
                .some(
                  (resultFieldBlock) =>
                    block.coords.x - resultFieldBlock.coords.x === 1 &&
                    block.coords.y === resultFieldBlock.coords.y,
                )
            ) {
              sides.push(Side.LEFT);
            }

            if (
              resultField.blockMatrix
                .flat()
                .some(
                  (resultFieldBlock) =>
                    resultFieldBlock.coords.y - block.coords.y === 1 &&
                    block.coords.x === resultFieldBlock.coords.x,
                )
            ) {
              sides.push(Side.BOTTOM);
            }

            return sides;
          }),
        ],
        [],
      ),
    );
  }

  private isResultFieldCollisionBlocks(
    shape: Shape,
    resultField: ResultField,
  ): boolean {
    return shape.blockMatrix
      .flat()
      .some(
        (block) =>
          block.isFilled &&
          resultField.blockMatrix
            .flat()
            .find(
              (resultFieldBlock) =>
                resultFieldBlock.coords.x === block.coords.x &&
                resultFieldBlock.coords.y === block.coords.y,
            ),
      );
  }

  private isBarriersCollisionBlocks(
    shape: Shape,
    barriersCoords: ICoords,
  ): boolean {
    return shape.blockMatrix
      .flat()
      .some(
        (block) =>
          block.isFilled &&
          (block.coords.x > barriersCoords.x ||
            block.coords.x < 0 ||
            block.coords.y > barriersCoords.y),
      );
  }

  private getStepsForRealiseByDirection(
    shape: Shape,
    resultField: ResultField,
    direction: Exclude<Direction, Direction.DOWN>,
    barriersCoords: ICoords,
  ): number {
    const shapeClone = this.shapeFactory.create(shape.type);
    let count = 0;

    shapeClone.moveToCoords(shape.getCurrentCoords());
    shapeClone.rotate(shape.rotateIndex);

    while (this.isShapeCollision(shapeClone, resultField, barriersCoords)) {
      shapeClone.moveDirection(direction);
      count++;

      if (count > barriersCoords.y) {
        break;
      }
    }

    return count;
  }

  public getLimitationSides(
    shape: Shape,
    resultField: ResultField,
    barriersCoords: ICoords,
  ): Set<IShapeMoveLimitationSides> {
    return new Set([
      ...this.getTouchedBarrierSides(shape, barriersCoords),
      ...this.getTouchedResultFieldSides(shape, resultField),
    ]);
  }

  public isShapeCollision(
    shape: Shape,
    resultField: ResultField,
    barriersCoords: ICoords,
  ): boolean {
    return (
      this.isBarriersCollisionBlocks(shape, barriersCoords) ||
      this.isResultFieldCollisionBlocks(shape, resultField)
    );
  }

  public getStepsForCollisionRealise(
    shape: Shape,
    resultField: ResultField,
    barriersCoords: ICoords,
  ): { direction: Direction; steps: number } | null {
    const stepsToRealise = [
      {
        direction: Direction.LEFT,
        steps: this.getStepsForRealiseByDirection(
          shape,
          resultField,
          Direction.LEFT,
          barriersCoords,
        ),
      },
      {
        direction: Direction.RIGHT,
        steps: this.getStepsForRealiseByDirection(
          shape,
          resultField,
          Direction.RIGHT,
          barriersCoords,
        ),
      },
      {
        direction: Direction.UP,
        steps: this.getStepsForRealiseByDirection(
          shape,
          resultField,
          Direction.UP,
          barriersCoords,
        ),
      },
    ];

    const minStepsToRealise = stepsToRealise.reduce<
      | { direction: null; steps: number }
      | { direction: Direction; steps: number }
    >(
      (acc, step) => {
        if (acc.steps > step.steps) {
          return step;
        }

        return acc;
      },
      {
        direction: null,
        steps: Number.POSITIVE_INFINITY,
      },
    );

    return minStepsToRealise.direction ? minStepsToRealise : null;
  }
}
