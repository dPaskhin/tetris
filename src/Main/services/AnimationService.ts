import { injectable } from 'inversify';

@injectable()
export class AnimationService {
  private animationPerFrame(fn: () => void): void {
    fn();

    requestAnimationFrame(() => this.animationPerFrame(fn));
  }

  private animationPerSecond(fn: () => void): void {
    setTimeout(() => {
      fn();

      requestAnimationFrame(() => this.animationPerSecond(fn));
    }, 1_000);
  }

  public animate(
    onAnimatePerFrame: () => void,
    onAnimatePerSecond: () => void,
  ): void {
    this.animationPerFrame(onAnimatePerFrame);
    this.animationPerSecond(onAnimatePerSecond);
  }
}
