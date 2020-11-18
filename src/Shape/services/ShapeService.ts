import { IBlockMatrix } from '@src/Shape/interfaces/IBlockMatrix';
import { ShapeTypes } from '@src/Shape/enums/ShapeTypes';
import { BlockFactory } from '@src/Block/services/BlockFactory';
import { ICoords } from '@src/Common/interfaces/ICoords';
import { MoveSidesDirections } from '@src/Shape/enums/MoveSidesDirections';

export class ShapeService {
  public static SHAPE_SIZE = 4;

  private static rotateFilledTransposition(isFilledMatrix: boolean[][]): boolean[][] {
    let result: boolean[][] = [];

    isFilledMatrix.forEach((row, rowIdx) => {
      return row.forEach((block, blockIdx) => {
        if (!result[rowIdx]) {
          result[rowIdx] = [];
        }

        result[rowIdx][blockIdx] = isFilledMatrix[blockIdx][rowIdx];
      });
    });

    return result.map(row => row.reverse());
  }

  public static rotateTransposition(blockMatrix: IBlockMatrix, blockFactory: BlockFactory): IBlockMatrix {
    let result: IBlockMatrix = [];
    const rotatedFilledTransposed = ShapeService.rotateFilledTransposition(blockMatrix.map(row => row.map(block => block.isFilled)));

    rotatedFilledTransposed.forEach((row, rowIdx) => {
      row.forEach((filledItem, filledIdx) => {
        if (!result[rowIdx]) {
          result[rowIdx] = [];
        }

        result[rowIdx][filledIdx] = blockFactory.create(blockMatrix[rowIdx][filledIdx].coords, filledItem);
      });
    });

    return result;
  }

  public static moveDownTransposition(blockMatrix: IBlockMatrix): IBlockMatrix {
    return blockMatrix.map(row => row.map(block => ({
      ...block,
      coords: {
        ...block.coords,
        y: block.coords.y + 1,
      }
    })));
  }

  public static moveSidesTransposition(blockMatrix: IBlockMatrix, direction: MoveSidesDirections): IBlockMatrix {
    return blockMatrix.map(row => row.map(block => ({
      ...block,
      coords: {
        ...block.coords,
        x: block.coords.x + (direction === MoveSidesDirections.LEFT ? -1 : 1),
      }
    })));
  }

  public static getShapeFilledBlocks(type: ShapeTypes, x: number, y: number) {
    switch (type) {
      case ShapeTypes.STICK: {
        return y === 1;
      }
      case ShapeTypes.RECT: {
        return (y === 1 || y === 2) && (x === 1 || x === 2);
      }
      case ShapeTypes.L_RIGHT: {
        return (y === 0 && x === 2) || (y === 1 && x < 3);
      }
      case ShapeTypes.L_LEFT: {
        return (y === 0 && x === 0) || (y === 1 && x < 3);
      }
      case ShapeTypes.Z_RIGHT: {
        return (y === 1 && (x === 1 || x === 2)) || (y === 2 && (x === 0 || x === 1));
      }
      case ShapeTypes.Z_LEFT: {
        return (y === 1 && (x === 0 || x === 1)) || (y === 2 && (x === 1 || x === 2));
      }
      case ShapeTypes.T_SHAPE: {
        return (y === 0 && x === 1) || (y === 1 && x < 3);
      }
    }
  }

  public static moveToCoordsTransposition(blockMatrix: IBlockMatrix, coords: ICoords) {
    return blockMatrix.map(row => row.map(block => ({
      ...block,
      coords: {
        x: block.coords.x + coords.x,
        y: block.coords.y + coords.y,
      }
    })));
  }
}
