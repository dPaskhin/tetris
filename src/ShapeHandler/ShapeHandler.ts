import { CommonService } from '@src/Common/services/CommonService';
import { ShapeFactory } from '@src/Shape/services/ShapeFactory';
import { ShapeType } from '@src/Shape/enums/ShapeType';
import { Shape } from '@src/Shape/Shape';
import { MainCanvas } from '@src/Canvas/MainCanvas';

export class ShapeHandler {
  public readonly mainShape: Shape;

  public readonly futureShape: Shape;

  private futureShapeType: ShapeType;

  private futureShapeColor: string;

  constructor(
    private readonly mainCanvas: MainCanvas,
    private readonly commonService: CommonService,
    private readonly shapeFactory: ShapeFactory,
  ) {
    const randomShapeType = this.commonService.getRandomShapeType();
    const randomShapeColor = this.commonService.getRandomColor();
    const futureRandomShapeType = this.commonService.getRandomShapeType();
    const futureRandomShapeColor = this.commonService.getRandomColor();

    this.mainShape = shapeFactory.create(randomShapeType, randomShapeColor);
    this.futureShapeType = futureRandomShapeType;
    this.futureShapeColor = futureRandomShapeColor;
    this.futureShape = shapeFactory.create(
      futureRandomShapeType,
      futureRandomShapeColor,
    );

    this.moveMainShapeToCenterTop();
    this.moveFutureShapeToInitialPosition();
  }

  private moveMainShapeToCenterTop(): void {
    this.mainShape.moveToCoords({
      x:
        this.mainCanvas.blocksCountHorizontal / 2 -
        Math.round(this.mainShape.size / 2),
      y: 0,
    });
  }

  private moveFutureShapeToInitialPosition(): void {
    this.futureShape.moveToCoords({ x: 1, y: 1 });
  }

  public shapeUpdate(): void {
    const randomShapeType = this.commonService.getRandomShapeType();
    const randomShapeColor = this.commonService.getRandomColor();

    this.mainShape.update(this.futureShapeType, this.futureShapeColor);
    this.moveMainShapeToCenterTop();

    this.futureShapeType = randomShapeType;
    this.futureShapeColor = randomShapeColor;
    this.futureShape.update(randomShapeType, randomShapeColor);
    this.moveFutureShapeToInitialPosition();
  }
}
