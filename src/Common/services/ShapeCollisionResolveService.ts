import { injectable } from 'inversify';

import { Shape } from '@src/Shape/Shape';
import { ResultField } from '@src/ResultField/ResultField';
import { ShapeMoveLimitationService } from '@src/Common/services/ShapeMoveLimitationService';
import { ICoords } from '@src/Common/interfaces/ICoords';

@injectable()
export class ShapeCollisionResolveService {
  constructor(
    private readonly shapeMoveLimitationService: ShapeMoveLimitationService,
  ) {}

  // TODO refactor this, service must not mutate anything. Need to return info about possible shape realise
  public shapeRealise(
    shape: Shape,
    resultField: ResultField,
    barriersCoords: ICoords,
  ): void {
    const stepsToRealise = this.shapeMoveLimitationService.getStepsForCollisionRealise(
      shape,
      resultField,
      barriersCoords,
    );

    if (!stepsToRealise) {
      return;
    }

    shape.moveDirection(stepsToRealise.direction, stepsToRealise.steps);
  }
}
