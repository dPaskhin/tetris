import { injectable } from 'inversify';

import { Shape } from '@src/Shape/Shape';
import { ResultField } from '@src/ResultField/ResultField';
import { ShapeMoveLimitationService } from '@src/Main/services/ShapeMoveLimitationService';

@injectable()
export class ShapeCollisionResolveService {
  constructor(
    private readonly shapeMoveLimitationService: ShapeMoveLimitationService,
  ) {}

  public shapeRealise(shape: Shape, resultField: ResultField): void {
    const stepsToRealise = this.shapeMoveLimitationService.getStepsForCollisionRealise(
      shape,
      resultField,
    );

    if (!stepsToRealise) {
      return;
    }

    shape.moveDirection(stepsToRealise.direction, stepsToRealise.steps);
  }
}
