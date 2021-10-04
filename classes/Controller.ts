export class Controller {
  private keys: Map<string, boolean>;
  constructor() {
    this.keys = new Map<string, boolean>();
    window.addEventListener('keydown', (e) => {
      this.onKeyDown(e);
    });
    window.addEventListener('keyup', (e) => {
      this.onKeyUp(e);
    });
  }

  public onKeyDown(e: KeyboardEvent): void {
    this.keys.set(e.key, true);
  }
  public onKeyUp(e: KeyboardEvent): void {
    this.keys.set(e.key, false);
  }
  public isDown(key: string): boolean {
    return this.keys.get(key);
  }
}
