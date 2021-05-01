import { injectable } from 'inversify';

import { Animation } from '@src/Animation/Animation';
import { IDummyFunction } from '@src/Common/interfaces/IDummyFunction';

@injectable()
export class AnimationFactory {
  public create(
    onPerFrame: IDummyFunction,
    onPerStep: IDummyFunction,
  ): Animation {
    return new Animation(onPerFrame, onPerStep);
  }
}
