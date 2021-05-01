import { Shape } from '@src/Shape/Shape';
import { IBlockMatrix } from '@src/Common/interfaces/IBlockMatrix';
import { CommonService } from '@src/Common/services/CommonService';
import { ResultFieldService } from '@src/ResultField/services/ResultFieldService';

export class ResultField {
  public blockMatrix: IBlockMatrix = [];

  constructor(
    private readonly commonService: CommonService,
    private readonly resultFieldService: ResultFieldService,
  ) {}

  public addShape(shape: Shape): void {
    this.blockMatrix = this.resultFieldService.concatBlockMatrix(
      shape.blockMatrix,
      this.blockMatrix,
    );
  }

  public deleteRows(coordYList: number[]): void {
    this.blockMatrix = this.blockMatrix.filter(
      (row) => !row.some((block) => coordYList.includes(block.coords.y)),
    );

    this.blockMatrix = this.commonService.blockMatrixMap(
      this.blockMatrix,
      ({ block, row }) => {
        const rowCoordY = this.commonService.findRowCoordY(row);

        if (rowCoordY === null) {
          return block;
        }

        return {
          ...block,
          coords: {
            ...block.coords,
            y:
              block.coords.y +
              coordYList.filter((deleteCoordY) => deleteCoordY > rowCoordY)
                .length,
          },
        };
      },
    );
  }

  public reset(): void {
    this.blockMatrix = [];
  }
}
