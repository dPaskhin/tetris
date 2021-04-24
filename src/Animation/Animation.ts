export class Animation {
  private readonly baseStepTime = 1_000;

  private perFrameTimerId: number;

  private perSecondTimerId: number;

  public stepTime: number;

  constructor() {
    this.perFrameTimerId = 0;
    this.perSecondTimerId = 0;
    this.stepTime = this.baseStepTime;
  }

  private animationPerFrame(fn: () => void): void {
    fn();

    this.perFrameTimerId = requestAnimationFrame(() =>
      this.animationPerFrame(fn),
    );
  }

  private animationPerStep(fn: () => void): void {
    this.perSecondTimerId = setTimeout(() => {
      fn();

      requestAnimationFrame(() => this.animationPerStep(fn));
    }, this.stepTime);
  }

  public animate(
    onAnimatePerFrame: () => void,
    onAnimatePerStep: () => void,
  ): void {
    this.animationPerFrame(onAnimatePerFrame);
    this.animationPerStep(onAnimatePerStep);
  }

  public stop(): void {
    cancelAnimationFrame(this.perFrameTimerId);
    clearTimeout(this.perSecondTimerId);
  }

  public updateStepTime(ratio: number): void {
    const newStepTime = this.baseStepTime / ratio;

    if (newStepTime < 20) {
      return;
    }

    this.stepTime = newStepTime;
  }
}
