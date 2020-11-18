import { ShapeTypes } from '@src/Shape/enums/ShapeTypes';
import { BlockFactory } from '@src/Block/services/BlockFactory';
import { Shape } from '@src/Shape/Shape';
import { Block } from '@src/Block/Block';
import { ShapeService } from '@src/Shape/services/ShapeService';

export class ShapeFactory {
  constructor(
    private readonly blockFactory: BlockFactory,
  ) {}

  public create(type: ShapeTypes): Shape {
    let blocksMatrix: Block[][] = [];

    for (let y = 0; y < ShapeService.SHAPE_SIZE; y++) {
      let row: Block[] = [];

      for (let x = 0; x < ShapeService.SHAPE_SIZE; x++) {
        const isFilled = ShapeService.getShapeFilledBlocks(type, x, y);

        row.push(this.blockFactory.create({ x, y }, isFilled));
      }

      blocksMatrix.push(row);
    }

    return new Shape(blocksMatrix, this.blockFactory);
  }
}
