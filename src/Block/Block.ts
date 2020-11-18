import { ICoords } from '@src/Common/interfaces/ICoords';
import { BlockService } from '@src/Block/services/BlockService';

export class Block {
  public readonly width = BlockService.BLOCK_SIZE;
  public readonly height = BlockService.BLOCK_SIZE;
  public readonly color: string;
  public readonly borderColor: string;

  constructor(
    public coords: ICoords,
    public isFilled: boolean,
  ) {
    this.color = isFilled ? '#f00' : 'transparent';
    this.borderColor = isFilled ? '#ccc' : 'transparent';
  }
}
