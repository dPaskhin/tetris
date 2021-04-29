import { injectable } from 'inversify';

import { Timer } from '@src/Timer/Timer';
import { IAnyFunction } from '@src/Common/interfaces/IAnyFunction';

@injectable()
export class TimerFactory {
  public create(timer: IAnyFunction, timeout?: number): Timer {
    return new Timer(timer, timeout);
  }
}
