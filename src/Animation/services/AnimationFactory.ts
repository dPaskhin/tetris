import { injectable } from 'inversify';

import { Animation } from '@src/Animation/Animation';

@injectable()
export class AnimationFactory {
  public create(): Animation {
    return new Animation();
  }
}
