export default class Boid {
  position: Vector2D;
  velocity: Vector2D;
  acceleration: Vector2D;
  maxSpeed: number;
  maxForce: number;

  constructor(canvas: HTMLCanvasElement, maxSpeed: number, maxForce: number) {
    this.position = {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
    };

    this.velocity = {
      x: Math.random() * 2 - 1, // [-1, 1]
      y: Math.random() * 2 - 1,
    };

    this.acceleration = {
      x: 0,
      y: 0,
    };

    this.maxSpeed = maxSpeed;
    this.maxForce = maxForce;
  }

  update(settings: Settings) {
    const randomForce = {
      x: (Math.random() * 2 - 1) * settings.randomness,
      y: (Math.random() * 2 - 1) * settings.randomness,
    };
    this.applyForce(randomForce);

    this.velocity.x += this.acceleration.x;
    this.velocity.y += this.acceleration.y;

    // Limit speed
    const speed = Math.sqrt(this.velocity.x ** 2 + this.velocity.y ** 2);
    if (speed > this.maxSpeed) {
      const ratio = this.maxSpeed / speed;
      this.velocity.x *= ratio;
      this.velocity.y *= ratio;
    }

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    this.acceleration.x = 0;
    this.acceleration.y = 0;
  }

  applyForce(force: Vector2D) {
    this.acceleration.x += force.x;
    this.acceleration.y += force.y;
  }
}
