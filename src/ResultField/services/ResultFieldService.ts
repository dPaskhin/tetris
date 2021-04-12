import { injectable } from 'inversify';

import { IBlockMatrix } from '@src/Common/interfaces/IBlockMatrix';
import { CommonService } from '@src/Common/services/CommonService';

@injectable()
export class ResultFieldService {
  constructor(private readonly commonService: CommonService) {}

  public concatBlockMatrix(
    shapeBlockMatrix: IBlockMatrix,
    resultFieldBlockMatrix: IBlockMatrix,
  ): IBlockMatrix {
    const newResultFieldBlockMatrix = [...resultFieldBlockMatrix];

    this.commonService.blockMatrixEach(shapeBlockMatrix, ({ block }) => {
      if (!block.isFilled) {
        return;
      }

      if (
        newResultFieldBlockMatrix.some(
          (row) => this.commonService.findRowCoordY(row) === block.coords.y,
        )
      ) {
        newResultFieldBlockMatrix.forEach((row) => {
          if (this.commonService.findRowCoordY(row) === block.coords.y) {
            return row.push(block);
          }

          return row;
        });

        return;
      }

      newResultFieldBlockMatrix.push([block]);
    });

    return newResultFieldBlockMatrix;
  }
}
