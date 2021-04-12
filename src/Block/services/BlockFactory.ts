import { injectable } from 'inversify';

import { ICoords } from '@src/Common/interfaces/ICoords';
import { Block } from '@src/Block/Block';

@injectable()
export class BlockFactory {
  public create(coords: ICoords, isFilled: boolean, color: string): Block {
    return new Block(coords, isFilled, color);
  }
}
