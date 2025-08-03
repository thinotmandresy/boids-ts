export default class FPSCounter {
  private fpsElement: HTMLSpanElement;
  private lastTime: number;
  private frameCount: number;
  private fps: number;

  constructor(fpsElementId: string) {
    this.fpsElement = document.querySelector<HTMLSpanElement>(`#${fpsElementId}`)!;
    this.lastTime = performance.now();
    this.frameCount = 0;
    this.fps = 0;
  }

  update() {
    const currentTime = performance.now();
    this.frameCount++;
    
    // Update FPS every 0.5 seconds
    if (currentTime - this.lastTime >= 500) {
      this.fps = (this.frameCount * 1000) / (currentTime - this.lastTime);
      this.fpsElement.textContent = this.fps.toFixed(1);
      this.frameCount = 0;
      this.lastTime = currentTime;
    }
  }
}
