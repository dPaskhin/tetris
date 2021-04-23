export class Score {
  private readonly $lines: HTMLDivElement;

  private readonly $level: HTMLDivElement;

  public lines: number;

  public level: number;

  constructor() {
    const $score = document.querySelector('#score');
    const $lines = $score?.querySelector('#lines') as HTMLDivElement | null;
    const $level = $score?.querySelector('#level') as HTMLDivElement | null;

    if (!$lines || !$level) {
      throw new Error(`There is no a lines or a level block`);
    }

    this.$lines = $lines;
    this.lines = 0;
    this.$lines.textContent = this.lines.toLocaleString();

    this.$level = $level;
    this.level = 1;
    this.$level.textContent = this.level.toLocaleString();
  }

  public updateLines(lines: number): void {
    this.lines = lines;
    this.$lines.textContent = this.lines.toLocaleString();
  }

  public updateLevel(level: number): void {
    this.level = level;
    this.$level.textContent = this.level.toLocaleString();
  }
}
