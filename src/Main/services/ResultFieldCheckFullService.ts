import { injectable } from 'inversify';

import { ResultField } from '@src/ResultField/ResultField';
import { ConfigService } from '@src/Common/services/ConfigService';

@injectable()
export class ResultFieldCheckFullService {
  public getFullRows(resultField: ResultField): number[] {
    return resultField.blockMatrix
      .filter(
        (row) => row.length === ConfigService.CANVAS_BLOCKS_COUNT_HORIZONTAL,
      )
      .map((row) => row[0].coords.y);
  }
}
