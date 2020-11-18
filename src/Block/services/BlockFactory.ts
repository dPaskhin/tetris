import { ICoords } from '@src/Common/interfaces/ICoords';
import { Block } from '@src/Block/Block';

export class BlockFactory {
  public create(coords: ICoords, isFilled: boolean): Block {
    return new Block(coords, isFilled);
  }
}
