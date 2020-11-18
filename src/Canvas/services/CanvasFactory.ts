import { Canvas } from '@src/Canvas/Canvas';

export class CanvasFactory {
  public create(): Canvas | undefined {
    const $canvas = document.getElementById('canvas') as HTMLCanvasElement;

    if (!$canvas) {
      return;
    }

    const ctx = $canvas.getContext('2d');

    if (!ctx) {
      return;
    }

    return new Canvas($canvas, ctx);
  }
}
