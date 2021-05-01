import { injectable } from 'inversify';

import { KeyControls } from '@src/KeyControls/KeyControls';
import { ShapeMoveLimitationService } from '@src/Common/services/ShapeMoveLimitationService';
import { ShapeCollisionResolveService } from '@src/Common/services/ShapeCollisionResolveService';
import { Shape } from '@src/Shape/Shape';
import { ResultField } from '@src/ResultField/ResultField';
import { MainCanvas } from '@src/Canvas/MainCanvas';
import { Animation } from '@src/Animation/Animation';

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
    animation,
  }: {
    shape: Shape;
    resultField: ResultField;
    canvas: MainCanvas;
    animation: Animation;
  }): KeyControls {
    return new KeyControls(
      shape,
      resultField,
      canvas,
      animation,
      this.shapeMoveLimitationService,
      this.shapeCollisionResolveService,
    );
  }
}
