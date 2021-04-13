import { injectable } from 'inversify';

import { ResultField } from '@src/ResultField/ResultField';

@injectable()
export class ResultFieldCheckFullService {
  public getFullRows(
    resultField: ResultField,
    rowBlocksCount: number,
  ): number[] {
    return resultField.blockMatrix
      .filter((row) => row.length === rowBlocksCount)
      .map((row) => row[0].coords.y);
  }
}
