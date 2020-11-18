import { ShapeService } from '@src/Shape/services/ShapeService';
import { IBlockMatrix } from '@src/Shape/interfaces/IBlockMatrix';
import { BlockFactory } from '@src/Block/services/BlockFactory';
import { ICoords } from '@src/Common/interfaces/ICoords';
import { CanvasService } from '@src/Canvas/services/CanvasService';
import { MoveSidesDirections } from '@src/Shape/enums/MoveSidesDirections';
import { BarrierTypes } from '@src/Shape/enums/BarrierTypes';

export class Shape {
  constructor(
    public blocksMatrix: IBlockMatrix,
    private readonly blockFactory: BlockFactory,
  ) {
  }

  public rotate() {
    this.blocksMatrix = ShapeService.rotateTransposition(this.blocksMatrix, this.blockFactory);
  };

  public moveDown() {
    this.blocksMatrix = ShapeService.moveDownTransposition(this.blocksMatrix);
  }

  public moveSides(direction: MoveSidesDirections) {
    this.blocksMatrix = ShapeService.moveSidesTransposition(this.blocksMatrix, direction);
  }

  public moveToCoords(coords: ICoords) {
    this.blocksMatrix = ShapeService.moveToCoordsTransposition(this.blocksMatrix, coords);
  }

  public checkBarriers(barrierType: BarrierTypes) {
    return this.blocksMatrix.some(row => row.some(block => {
      if (!block.isFilled) {
        return false;
      }

      switch (barrierType) {
        case BarrierTypes.BOTTOM: {
          return block.isFilled && (block.coords.y >= CanvasService.CANVAS_Y - 1);
        }
        case BarrierTypes.LEFT: {
          return block.coords.x <= 0;
        }
        case BarrierTypes.RIGHT: {
          return block.coords.x >= CanvasService.CANVAS_X - 1;
        }
      }
    }));
  }
}
