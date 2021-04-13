import { BaseCanvas } from '@src/Canvas/BaseCanvas';
import { Palette } from '@src/Common/enums/Palette';

export class GridCanvas extends BaseCanvas {
  public drawGrid(): void {
    const data = `<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <pattern 
              id="verticalLine" 
              width="${this.blockSize}"
              height="${this.blockSize}" 
              patternUnits="userSpaceOnUse"
            >
              <line x1="0" y1="0" x2="0" y2="${this.blockSize}" stroke="${Palette.GRAY}" stroke-width="1" />
            </pattern>

            <pattern 
              id="horizontalLine"
              width="${this.blockSize}" 
              height="${this.blockSize}" 
              patternUnits="userSpaceOnUse"
            >
              <line x1="0" y1="0" x2="${this.blockSize}80" y2="0" stroke="${Palette.GRAY}" stroke-width="1" />
            </pattern>
        </defs>

        <rect x="${this.blockSize}" width="100%" height="100%" fill="url(#verticalLine)" />
        <rect y="${this.blockSize}" width="100%" height="100%" fill="url(#horizontalLine)" />
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
