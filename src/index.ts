import 'reflect-metadata';
import { Container } from 'inversify';

import { Main } from '@src/Main/Main';
import { CanvasFactory } from '@src/Canvas/services/CanvasFactory';
import { ShapeFactory } from '@src/Shape/services/ShapeFactory';
import { AnimationService } from '@src/Main/services/AnimationService';
import { BlockFactory } from '@src/Block/services/BlockFactory';
import { Block } from '@src/Block/Block';
import { DrawingCanvas } from '@src/Canvas/DrawingCanvas';
import { Shape } from '@src/Shape/Shape';
import { ResultFieldFactory } from '@src/ResultField/services/ResultFieldFactory';
import { ShapeService } from '@src/Shape/services/ShapeService';
import { CommonService } from '@src/Common/services/CommonService';
import { ShapeMoveLimitationService } from '@src/Main/services/ShapeMoveLimitationService';
import { ShapeCollisionResolveService } from '@src/Main/services/ShapeCollisionResolveService';
import { ResultFieldService } from '@src/ResultField/services/ResultFieldService';
import { ResultField } from '@src/ResultField/ResultField';
import { ResultFieldCheckFullService } from '@src/Main/services/ResultFieldCheckFullService';

const container = new Container();

container.bind<Main>(Main).toSelf();
container.bind<CanvasFactory>(CanvasFactory).toSelf();
container.bind<ShapeFactory>(ShapeFactory).toSelf();
container.bind<AnimationService>(AnimationService).toSelf();
container.bind<BlockFactory>(BlockFactory).toSelf();
container.bind<Block>(Block).toSelf();
container.bind<DrawingCanvas>(DrawingCanvas).toSelf();
container.bind<Shape>(Shape).toSelf();
container.bind<ResultField>(ResultField).toSelf();
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

document.addEventListener('DOMContentLoaded', () => {
  try {
    container.get(Main);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
});
