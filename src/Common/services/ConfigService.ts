export class ConfigService {
  public static readonly BLOCK_SIZE = 20;

  public static readonly CANVAS_WIDTH = 400;

  public static readonly CANVAS_HEIGHT = 800;

  public static readonly CANVAS_BLOCKS_COUNT_HORIZONTAL =
    ConfigService.CANVAS_WIDTH / ConfigService.BLOCK_SIZE;

  public static readonly CANVAS_BLOCKS_COUNT_VERTICAL =
    ConfigService.CANVAS_HEIGHT / ConfigService.BLOCK_SIZE;
}
