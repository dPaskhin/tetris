import { injectable } from 'inversify';

import { IBlockMatrix } from '@src/Common/interfaces/IBlockMatrix';
import { Block } from '@src/Block/Block';
import { ShapeType } from '@src/Shape/enums/ShapeType';

@injectable()
export class CommonService {
  public createArray(count: number): null[] {
    return Array.from<null>({ length: count }).fill(null);
  }

  public blockMatrixMap(
    blockMatrix: IBlockMatrix,
    mapper: (params: {
      block: Block;
      row: Block[];
      blockIdx: number;
      rowIdx: number;
    }) => Block,
  ): IBlockMatrix {
    return blockMatrix.map((row, rowIdx) =>
      row.map((block, blockIdx) => mapper({ block, row, blockIdx, rowIdx })),
    );
  }

  public blockMatrixEach(
    blockMatrix: IBlockMatrix,
    fn: (params: { block: Block; blockIdx: number; rowIdx: number }) => void,
  ): void {
    blockMatrix.forEach((row, rowIdx) => {
      row.forEach((block, blockIdx) => fn({ block, blockIdx, rowIdx }));
    });
  }

  public findRowCoordY(row: Block[]): number | null {
    return row[0]?.coords.y || null;
  }

  public getRandomColor(): string {
    return `hsl(
    ${360 * Math.random()},
    ${25 + 70 * Math.random()}%,
    ${85 + 10 * Math.random()}%)`;
  }

  public getRandomShapeType(): ShapeType {
    return Object.values(ShapeType)[
      Math.floor(Math.random() * Object.values(ShapeType).length)
    ];
  }
}
