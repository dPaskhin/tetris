import { BaseCanvas } from '@src/Canvas/BaseCanvas';
import { Block } from '@src/Block/Block';

export class DrawingCanvas extends BaseCanvas {
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
