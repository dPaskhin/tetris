import { injectable } from 'inversify';

import { KeyControls } from '@src/KeyControls/KeyControls';
import { ShapeMoveLimitationService } from '@src/Common/services/ShapeMoveLimitationService';
import { ShapeCollisionResolveService } from '@src/Common/services/ShapeCollisionResolveService';
import { Shape } from '@src/Shape/Shape';
import { ResultField } from '@src/ResultField/ResultField';
import { MainCanvas } from '@src/Canvas/MainCanvas';

@injectable()
export class KeyControlsFactory {
  constructor(
    private readonly shapeMoveLimitationService: ShapeMoveLimitationService,
    private readonly shapeCollisionResolveService: ShapeCollisionResolveService,
  ) {}

  public create({
    shape,
    resultField,
    canvas,
  }: {
    shape: Shape;
    resultField: ResultField;
    canvas: MainCanvas;
  }): KeyControls {
    return new KeyControls(
      shape,
      resultField,
      canvas,
      this.shapeMoveLimitationService,
      this.shapeCollisionResolveService,
    );
  }
}
