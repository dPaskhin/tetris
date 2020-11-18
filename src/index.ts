import { Main } from '@src/Main/Main';
import { CanvasFactory } from '@src/Canvas/services/CanvasFactory';
import { BlockFactory } from '@src/Block/services/BlockFactory';
import { ShapeFactory } from '@src/Shape/services/ShapeFactory';

document.addEventListener('DOMContentLoaded', () => {
  const canvasFactory = new CanvasFactory();
  const blockFactory = new BlockFactory();
  const shapeFactory = new ShapeFactory(blockFactory);

  const main = new Main(canvasFactory, shapeFactory);

  main.execute();
});
