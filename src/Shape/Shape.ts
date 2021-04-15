import { ShapeService } from '@src/Shape/services/ShapeService';
import { ICoords } from '@src/Common/interfaces/ICoords';
import { ShapeType } from '@src/Shape/enums/ShapeType';
import { IBlockMatrix } from '@src/Common/interfaces/IBlockMatrix';
import { ShapeSize } from '@src/Shape/enums/ShapeSize';
import { Direction } from '@src/Common/enums/Direction';

export class Shape {
  public blockMatrix: IBlockMatrix;

  public size: ShapeSize;

  private _rotateIndex: number;

  public constructor(
    public type: ShapeType,
    private readonly shapeService: ShapeService,
  ) {
    this.blockMatrix = shapeService.createBlockMatrix(type);
    this.size = shapeService.getSize(type);
    this._rotateIndex = 0;
  }

  public update(type: ShapeType): void {
    this.type = type;
    this.blockMatrix = this.shapeService.createBlockMatrix(type);
    this._rotateIndex = 0;
  }

  public rotate(rotateIndex = 1): void {
    for (let i = 0; i < rotateIndex; i++) {
      this.blockMatrix = this.shapeService.rotateTransposition(
        this.blockMatrix,
      );
      this._rotateIndex = this._rotateIndex === 3 ? 0 : this._rotateIndex + 1;
    }
  }

  public get rotateIndex(): number {
    return this._rotateIndex;
  }

  public moveDirection(direction: Direction, steps?: number): void {
    this.blockMatrix = this.shapeService.moveDirectionTransposition(
      this.blockMatrix,
      direction,
      steps,
    );
  }

  public moveDown(): void {
    this.blockMatrix = this.shapeService.moveDirectionTransposition(
      this.blockMatrix,
      Direction.DOWN,
    );
  }

  public moveToCoords(coords: Partial<ICoords>): void {
    this.blockMatrix = this.shapeService.moveToCoordsTransposition(
      this.blockMatrix,
      {
        ...this.getCurrentCoords(),
        ...coords,
      },
    );
  }

  public getCurrentCoords(): ICoords {
    return this.blockMatrix.flat().reduce<ICoords>(
      (acc, block) => ({
        x: block.coords.x < acc.x ? block.coords.x : acc.x,
        y: block.coords.y < acc.y ? block.coords.y : acc.y,
      }),
      {
        x: Number.POSITIVE_INFINITY,
        y: Number.POSITIVE_INFINITY,
      },
    );
  }
}
