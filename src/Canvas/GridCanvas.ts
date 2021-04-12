import { BaseCanvas } from '@src/Canvas/BaseCanvas';
import { ConfigService } from '@src/Common/services/ConfigService';
import { CanvasId } from '@src/Canvas/enums/CanvasId';
import { Palette } from '@src/Common/enums/Palette';

export class GridCanvas extends BaseCanvas {
  constructor(width: number, height: number) {
    super(CanvasId.GRID, width, height);
  }

  public drawGrid(): void {
    const data = `<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <pattern 
              id="verticalLine" 
              width="${ConfigService.BLOCK_SIZE}"
              height="${ConfigService.BLOCK_SIZE}" 
              patternUnits="userSpaceOnUse"
            >
              <line x1="0" y1="0" x2="0" y2="${ConfigService.BLOCK_SIZE}" stroke="${Palette.GRAY}" stroke-width="1" />
            </pattern>

            <pattern 
              id="horizontalLine"
              width="${ConfigService.BLOCK_SIZE}" 
              height="${ConfigService.BLOCK_SIZE}" 
              patternUnits="userSpaceOnUse"
            >
              <line x1="0" y1="0" x2="${ConfigService.BLOCK_SIZE}80" y2="0" stroke="${Palette.GRAY}" stroke-width="1" />
            </pattern>
        </defs>

        <rect x="${ConfigService.BLOCK_SIZE}" width="100%" height="100%" fill="url(#verticalLine)" />
        <rect y="${ConfigService.BLOCK_SIZE}" width="100%" height="100%" fill="url(#horizontalLine)" />
    </svg>`;

    const img = new Image();
    const svg = new Blob([data], { type: 'image/svg+xml;' });
    const url = URL.createObjectURL(svg);

    img.addEventListener('load', () => {
      this.ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
    });

    img.src = url;
  }
}
