import { injectable } from 'inversify';

import { ShapeType } from '@src/Shape/enums/ShapeType';
import { BlockFactory } from '@src/Block/services/BlockFactory';
import { ICoords } from '@src/Common/interfaces/ICoords';
import { Block } from '@src/Block/Block';
import { IBlockMatrix } from '@src/Common/interfaces/IBlockMatrix';
import { ShapeSize } from '@src/Shape/enums/ShapeSize';
import { CommonService } from '@src/Common/services/CommonService';
import { Direction } from '@src/Common/enums/Direction';

@injectable()
export class ShapeService {
  public constructor(
    private readonly blockFactory: BlockFactory,
    private readonly commonService: CommonService,
  ) {}

  // eslint-disable-next-line sonarjs/cognitive-complexity
  private static getInitialIsFilledBlock(
    type: ShapeType,
    { x, y }: ICoords,
  ): boolean {
    const isFirstRow = y === 0;
    const isSecondRow = y === 1;
    const isFirstColumn = x === 0;
    const isSecondColumn = x === 1;
    const isThirdColumn = x === 2;

    switch (type) {
      case ShapeType.STICK: {
        return isSecondRow;
      }
      case ShapeType.RECT: {
        return (isFirstRow || isSecondRow) && (isFirstColumn || isSecondColumn);
      }
      case ShapeType.L: {
        return (isFirstRow && isThirdColumn) || (isSecondRow && x < 3);
      }
      case ShapeType.J: {
        return (isFirstRow && isFirstColumn) || (isSecondRow && x < 3);
      }
      case ShapeType.S: {
        return (
          (isFirstRow && (isSecondColumn || isThirdColumn)) ||
          (isSecondRow && (isFirstColumn || isSecondColumn))
        );
      }
      case ShapeType.Z: {
        return (
          (isFirstRow && (isFirstColumn || isSecondColumn)) ||
          (isSecondRow && (isSecondColumn || isThirdColumn))
        );
      }
      case ShapeType.T: {
        return (isFirstRow && isSecondColumn) || (isSecondRow && x < 3);
      }
      default: {
        return false;
      }
    }
  }

  public getSize(type: ShapeType): ShapeSize {
    switch (type) {
      case ShapeType.STICK: {
        return ShapeSize.LARGE;
      }
      case ShapeType.RECT: {
        return ShapeSize.SMALL;
      }
      default: {
        return ShapeSize.NORMAL;
      }
    }
  }

  public createBlockMatrix(type: ShapeType): IBlockMatrix {
    const shapeSize = this.getSize(type);
    const blockColor = this.commonService.getRandomColor();

    return this.commonService.createArray(shapeSize).map((_, rowIdx) =>
      this.commonService.createArray(shapeSize).map((__, blockIdx) =>
        this.blockFactory.create(
          { x: blockIdx, y: rowIdx },
          ShapeService.getInitialIsFilledBlock(type, {
            x: blockIdx,
            y: rowIdx,
          }),
          blockColor,
        ),
      ),
    );
  }

  public rotateTransposition(blockMatrix: IBlockMatrix): IBlockMatrix {
    return blockMatrix.map((row, rowIdx) =>
      row
        .map((block, blockIdx) => blockMatrix[blockIdx][rowIdx])
        .reverse()
        .map<Block>((block, blockIdx) => ({
          ...block,
          coords: {
            ...blockMatrix[rowIdx][blockIdx].coords,
          },
        })),
    );
  }

  public moveDirectionTransposition(
    blockMatrix: IBlockMatrix,
    direction: Direction,
    steps = 1,
  ): IBlockMatrix {
    return this.commonService.blockMatrixMap(blockMatrix, ({ block }) => ({
      ...block,
      coords: {
        x:
          direction === Direction.LEFT || direction === Direction.RIGHT
            ? block.coords.x + (direction === Direction.LEFT ? -steps : steps)
            : block.coords.x,
        y:
          direction === Direction.UP || direction === Direction.DOWN
            ? block.coords.y + (direction === Direction.UP ? -steps : steps)
            : block.coords.y,
      },
    }));
  }

  public moveToCoordsTransposition(
    blockMatrix: IBlockMatrix,
    coords: ICoords,
  ): IBlockMatrix {
    return this.commonService.blockMatrixMap(
      blockMatrix,
      ({ block, blockIdx, rowIdx }) => ({
        ...block,
        coords: {
          x: coords.x + blockIdx,
          y: coords.y + rowIdx,
        },
      }),
    );
  }
}
