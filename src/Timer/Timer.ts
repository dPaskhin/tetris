import { IAnyFunction } from '@src/Common/interfaces/IAnyFunction';

export class Timer {
  private timerId: number;

  constructor() {
    this.timerId = 0;
  }

  public start(timer: IAnyFunction, timeout?: number): void {
    this.stop();
    this.timerId = setTimeout(timer, timeout || 0);
  }

  public stop(): void {
    clearTimeout(this.timerId);
  }
}
