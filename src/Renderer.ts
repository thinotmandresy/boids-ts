import Boid from "./Boid";

export default class Renderer {
  private ctx: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  draw(boids: Boid[]) {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    for (const boid of boids) {
      const speed = Math.sqrt(boid.velocity.x ** 2 + boid.velocity.y ** 2);
      const hue = Math.min((speed / boid.maxSpeed) * 180, 180);
      this.ctx.fillStyle = `hsl(${hue}, 100%, 60%)`;

      const angle = Math.atan2(boid.velocity.y, boid.velocity.x);
      this.ctx.save();
      this.ctx.translate(boid.position.x, boid.position.y);
      this.ctx.rotate(angle);
      this.ctx.beginPath();
      this.ctx.moveTo(7, 0);
      this.ctx.lineTo(-5, 4);
      this.ctx.lineTo(-5, -4);
      this.ctx.closePath();
      this.ctx.fill();
      this.ctx.restore();
    }
  }
}
