import { IDummyFunction } from '@src/Common/interfaces/IDummyFunction';

export class Animation {
  private readonly baseStepTime = 1_000;

  private readonly $pauseOverlay: HTMLDivElement;

  private perFrameTimerId: number;

  private perSecondTimerId: number;

  public stepTime: number;

  public paused: boolean;

  public stopped: boolean;

  constructor(
    private readonly onPerFrame: IDummyFunction,
    private readonly onPerStep: IDummyFunction,
  ) {
    const $pauseOverlay = document.querySelector('#overlay') as HTMLDivElement;

    if (!$pauseOverlay) {
      throw new Error('There is no pause overlay');
    }

    this.$pauseOverlay = $pauseOverlay;

    this.perFrameTimerId = 0;
    this.perSecondTimerId = 0;
    this.stepTime = this.baseStepTime;

    this.animationPerFrame();
    this.animationPerStep();

    this.paused = false;
    this.stopped = false;
  }

  private animationPerFrame(): void {
    this.onPerFrame();

    this.perFrameTimerId = requestAnimationFrame(
      this.animationPerFrame.bind(this),
    );
  }

  private animationPerStep(): void {
    this.perSecondTimerId = setTimeout(() => {
      this.onPerStep();

      requestAnimationFrame(this.animationPerStep.bind(this));
    }, this.stepTime);
  }

  private cancelAnimation(): void {
    cancelAnimationFrame(this.perFrameTimerId);
    clearTimeout(this.perSecondTimerId);
  }

  private resumeAnimation(): void {
    this.animationPerFrame();
    this.animationPerStep();
  }

  public stop(): void {
    this.cancelAnimation();

    this.stopped = true;
  }

  public resume(): void {
    this.resumeAnimation();

    this.stopped = false;
  }

  public togglePause(): void {
    if (!this.paused) {
      this.togglePauseOverlay(true);

      this.paused = true;

      this.cancelAnimation();

      return;
    }

    this.togglePauseOverlay(false);

    this.paused = false;

    this.resumeAnimation();
  }

  public updateStepTime(ratio: number): void {
    const newStepTime = this.baseStepTime / ratio;

    if (newStepTime < 20) {
      return;
    }

    this.stepTime = newStepTime;
  }

  public togglePauseOverlay(show: boolean): void {
    if (show) {
      this.$pauseOverlay.classList.add('_shown');

      return;
    }

    this.$pauseOverlay.classList.remove('_shown');
  }
}
