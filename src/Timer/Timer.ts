export class Timer {
  private timerId: number;

  public isContinue = false;

  constructor(
    private readonly timer: () => void,
    private readonly timeout: number = 0,
  ) {
    this.timerId = 0;
  }

  public start(): void {
    this.timerId = setTimeout(() => {
      this.timer();
    }, this.timeout);
    this.isContinue = true;
  }

  public restart(): void {
    this.stop();
    this.start();
  }

  public stop(): void {
    clearTimeout(this.timerId);
    this.isContinue = false;
  }
}
