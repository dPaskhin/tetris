import { injectable } from 'inversify';

import { Score } from '@src/Score/Score';

@injectable()
export class ScoreFactory {
  public create(): Score {
    return new Score();
  }
}
