import { injectable } from 'inversify';

import { ShapeHandler } from '@src/ShapeHandler/ShapeHandler';
import { CommonService } from '@src/Common/services/CommonService';
import { ShapeFactory } from '@src/Shape/services/ShapeFactory';
import { MainCanvas } from '@src/Canvas/MainCanvas';

@injectable()
export class ShapeHandlerFactory {
  constructor(
    private readonly commonService: CommonService,
    private readonly shapeFactory: ShapeFactory,
  ) {}

  public create(mainCanvas: MainCanvas): ShapeHandler {
    return new ShapeHandler(mainCanvas, this.commonService, this.shapeFactory);
  }
}
