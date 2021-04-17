export class Animation {
  private perFrameTimerId: number;

  private perSecondTimerId: number;

  constructor() {
    this.perFrameTimerId = 0;
    this.perSecondTimerId = 0;
  }

  private animationPerFrame(fn: () => void): void {
    fn();

    this.perFrameTimerId = requestAnimationFrame(() =>
      this.animationPerFrame(fn),
    );
  }

  private animationPerSecond(fn: () => void): void {
    this.perSecondTimerId = setTimeout(() => {
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

  public stop(): void {
    cancelAnimationFrame(this.perFrameTimerId);
    clearTimeout(this.perSecondTimerId);
  }
}
