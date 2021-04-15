import { ICoords } from '@src/Common/interfaces/ICoords';
import { Palette } from '@src/Common/enums/Palette';

export class Block {
  public readonly isFilled: boolean;

  public readonly color: string;

  public readonly borderColor: string;

  constructor(public coords: ICoords, isFilled: boolean, color: string) {
    this.isFilled = isFilled;
    this.color = isFilled ? color : 'transparent';
    this.borderColor = isFilled ? Palette.GRAY : 'transparent';
  }
}
