import { Shape } from '@src/Shape/Shape';

export class CanvasService {
  public static readonly CANVAS_WIDTH = 400;
  public static readonly CANVAS_HEIGHT = 800;
  public static readonly CANVAS_X = 20;
  public static readonly CANVAS_Y = 40;

  public static setCanvasSize($canvas: HTMLCanvasElement) {
    $canvas.width = CanvasService.CANVAS_WIDTH;
    $canvas.height = CanvasService.CANVAS_HEIGHT;
  }

  public static drawShape(shape: Shape, ctx: CanvasRenderingContext2D) {
    for (const row of shape.blocksMatrix) {
      for (const { coords, height, width, color, borderColor } of row) {
        ctx.beginPath();
        ctx.rect(coords.x * width, coords.y * height, width, height);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = borderColor;
        ctx.stroke();
      }
    }
  }

  public static clear(ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, CanvasService.CANVAS_WIDTH, CanvasService.CANVAS_HEIGHT);
  }
}
