import { BlockSize } from '@src/Canvas/enums/BlockSize';

export class BaseCanvas {
  protected readonly $canvas: HTMLCanvasElement;

  protected readonly ctx: CanvasRenderingContext2D;

  public readonly blockSize: number;

  public readonly blocksCountHorizontal: number;

  public readonly blocksCountVertical: number;

  constructor(
    public readonly id: string,
    public readonly width: number,
    public readonly height: number,
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
    this.blockSize = BlockSize.SIZE;
    this.blocksCountHorizontal = this.width / this.blockSize;
    this.blocksCountVertical = this.height / this.blockSize;
  }

  public clear(): void {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }
}
