import { injectable } from 'inversify';

import { Timer } from '@src/Timer/Timer';

@injectable()
export class TimerFactory {
  public create(): Timer {
    return new Timer();
  }
}
