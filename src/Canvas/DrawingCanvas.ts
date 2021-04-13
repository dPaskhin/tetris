import { injectable } from 'inversify';

import { Block } from '@src/Block/Block';
import { BaseCanvas } from '@src/Canvas/BaseCanvas';
import { CanvasId } from '@src/Canvas/enums/CanvasId';
import { MainCanvasSize } from '@src/Canvas/enums/MainCanvasSize';

@injectable()
export class DrawingCanvas extends BaseCanvas {
  constructor() {
    super(CanvasId.DRAWING, MainCanvasSize.WIDTH, MainCanvasSize.HEIGHT);
  }

  public drawBlocks(blocks: Block[]): void {
    blocks.forEach(({ coords, color, borderColor }) => {
      this.ctx.beginPath();
      this.ctx.rect(
        coords.x * this.blockSize,
        coords.y * this.blockSize,
        this.blockSize,
        this.blockSize,
      );
      this.ctx.fillStyle = color;
      this.ctx.fill();
      this.ctx.strokeStyle = borderColor;
      this.ctx.stroke();
    });
  }
}
