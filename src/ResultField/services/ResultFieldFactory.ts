import { injectable } from 'inversify';

import { ResultField } from '@src/ResultField/ResultField';
import { CommonService } from '@src/Common/services/CommonService';
import { ResultFieldService } from '@src/ResultField/services/ResultFieldService';

@injectable()
export class ResultFieldFactory {
  constructor(
    private readonly commonService: CommonService,
    private readonly resultFieldService: ResultFieldService,
  ) {}

  public create(): ResultField {
    return new ResultField(this.commonService, this.resultFieldService);
  }
}
