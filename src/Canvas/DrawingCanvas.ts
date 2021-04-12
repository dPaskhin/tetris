import { injectable } from 'inversify';

import { ConfigService } from '@src/Common/services/ConfigService';
import { Block } from '@src/Block/Block';
import { BaseCanvas } from '@src/Canvas/BaseCanvas';
import { CanvasId } from '@src/Canvas/enums/CanvasId';

@injectable()
export class DrawingCanvas extends BaseCanvas {
  constructor(width: number, height: number) {
    super(CanvasId.DRAWING, width, height);
  }

  public drawBlocks(blocks: Block[]): void {
    blocks.forEach(({ coords, height, width, color, borderColor }) => {
      this.ctx.beginPath();
      this.ctx.rect(coords.x * width, coords.y * height, width, height);
      this.ctx.fillStyle = color;
      this.ctx.fill();
      this.ctx.strokeStyle = borderColor;
      this.ctx.stroke();
    });
  }

  public clear(): void {
    this.ctx.clearRect(
      0,
      0,
      ConfigService.CANVAS_WIDTH,
      ConfigService.CANVAS_HEIGHT,
    );
  }
}
