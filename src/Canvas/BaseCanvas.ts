export class BaseCanvas {
  protected readonly $canvas: HTMLCanvasElement;

  protected readonly ctx: CanvasRenderingContext2D;

  constructor(
    public readonly id: string,
    protected readonly width: number,
    protected readonly height: number,
  ) {
    const $canvas = document.querySelector(`#${id}`) as HTMLCanvasElement;

    if (!$canvas) {
      throw new Error(`There is no a canvas node for id: ${id}`);
    }

    const ctx = $canvas.getContext('2d');

    if (!ctx) {
      throw new Error(`There is no a canvas context for canvas by id: ${id}`);
    }

    $canvas.width = this.width;
    $canvas.height = this.height;

    this.$canvas = $canvas;
    this.ctx = ctx;
  }
}
