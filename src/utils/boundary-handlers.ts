import Boid from "../Boid";

export function wrapAround(boid: Boid, canvas: HTMLCanvasElement): void {
  if (boid.position.x < 0) boid.position.x += canvas.width;
  if (boid.position.x > canvas.width) boid.position.x -= canvas.width;

  if (boid.position.y < 0) boid.position.y += canvas.height;
  if (boid.position.y > canvas.height) boid.position.y -= canvas.height;
}

export function bounceOffEdges(boid: Boid, canvas: HTMLCanvasElement): void {
  if (boid.position.x < 0) {
    boid.position.x = 0;
    boid.velocity.x = -boid.velocity.x;
  }
  if (boid.position.x > canvas.width) {
    boid.position.x = canvas.width;
    boid.velocity.x = -boid.velocity.x;
  }

  if (boid.position.y < 0) {
    boid.position.y = 0;
    boid.velocity.y = -boid.velocity.y;
  }
  if (boid.position.y > canvas.height) {
    boid.position.y = canvas.height;
    boid.velocity.y = -boid.velocity.y;
  }
}
