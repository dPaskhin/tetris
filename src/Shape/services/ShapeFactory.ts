import { injectable } from 'inversify';

import { ShapeType } from '@src/Shape/enums/ShapeType';
import { Shape } from '@src/Shape/Shape';
import { ShapeService } from '@src/Shape/services/ShapeService';

@injectable()
export class ShapeFactory {
  constructor(private readonly shapeService: ShapeService) {}

  public create(type: ShapeType, color?: string): Shape {
    return new Shape(type, color, this.shapeService);
  }
}
