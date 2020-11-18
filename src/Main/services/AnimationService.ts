export class AnimationService {
  private moveDownCounter = 0;

  private animationPerSecondStep(callback: () => void) {
    if (this.moveDownCounter === 10) {
      callback();

      this.moveDownCounter = 0;
    }

    this.moveDownCounter++;
  }

  public animate(onAnimateStep: () => void, onAnimatePerSecondStep: () => void) {
    onAnimateStep();

    this.animationPerSecondStep(onAnimatePerSecondStep);

    requestAnimationFrame(() => this.animate(onAnimateStep, onAnimatePerSecondStep));
  }
}
