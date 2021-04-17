import 'reflect-metadata';
import { Container } from 'inversify';

import { Main } from '@src/Main/Main';
import { CanvasFactory } from '@src/Canvas/services/CanvasFactory';
import { ShapeFactory } from '@src/Shape/services/ShapeFactory';
import { AnimationFactory } from '@src/Animation/services/AnimationFactory';
import { BlockFactory } from '@src/Block/services/BlockFactory';
import { ResultFieldFactory } from '@src/ResultField/services/ResultFieldFactory';
import { ShapeService } from '@src/Shape/services/ShapeService';
import { CommonService } from '@src/Common/services/CommonService';
import { ShapeMoveLimitationService } from '@src/Main/services/ShapeMoveLimitationService';
import { ShapeCollisionResolveService } from '@src/Main/services/ShapeCollisionResolveService';
import { ResultFieldService } from '@src/ResultField/services/ResultFieldService';
import { ResultFieldCheckFullService } from '@src/Main/services/ResultFieldCheckFullService';
import { TimerFactory } from '@src/Timer/services/TimerFactory';

const container = new Container();

container.bind<Main>(Main).toSelf();
container.bind<CanvasFactory>(CanvasFactory).toSelf();
container.bind<ShapeFactory>(ShapeFactory).toSelf();
container.bind<AnimationFactory>(AnimationFactory).toSelf();
container.bind<BlockFactory>(BlockFactory).toSelf();
container.bind<ResultFieldFactory>(ResultFieldFactory).toSelf();
container.bind<ShapeService>(ShapeService).toSelf();
container.bind<CommonService>(CommonService).toSelf();
container.bind<ShapeMoveLimitationService>(ShapeMoveLimitationService).toSelf();
container
  .bind<ShapeCollisionResolveService>(ShapeCollisionResolveService)
  .toSelf();
container.bind<ResultFieldService>(ResultFieldService).toSelf();
container
  .bind<ResultFieldCheckFullService>(ResultFieldCheckFullService)
  .toSelf();
container.bind<TimerFactory>(TimerFactory).toSelf();

document.addEventListener('DOMContentLoaded', () => {
  try {
    container.get(Main);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
});
