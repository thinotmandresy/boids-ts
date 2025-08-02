import Boid from "./Boid";

export default class Flock {
  boids: Boid[];
  settings: Settings;

  constructor(canvas: HTMLCanvasElement, count: number, settings: Settings) {
    this.boids = Array.from(
      { length: count }, 
      () => new Boid(canvas, settings.maxSpeed, settings.maxForce)
    );
    this.settings = { ...settings };
  }

  update(canvas: HTMLCanvasElement, boundaryHandler: (boid: Boid, canvas: HTMLCanvasElement) => void) {
    for (const boid of this.boids) {
      this.flock(boid);
      boid.update(this.settings);
      boundaryHandler(boid, canvas);
    }
  }

  flock(boid: Boid) {
    const cohesion = { x: 0, y: 0 };
    const alignment = { x: 0, y: 0 };
    const separation = { x: 0, y: 0 };
    let cohesionCount = 0;
    let alignmentCount = 0;
    let separationCount = 0;

    for (const neighbor of this.boids) {
      if (neighbor === boid) continue;

      const dx = neighbor.position.x - boid.position.x;
      const dy = neighbor.position.y - boid.position.y;
      const distance = Math.sqrt(dx ** 2 + dy ** 2);

      if (distance < this.settings.perceptionRadius) {
        cohesion.x += neighbor.position.x;
        cohesion.y += neighbor.position.y;
        cohesionCount++;
        
        alignment.x += neighbor.velocity.x;
        alignment.y += neighbor.velocity.y;
        alignmentCount++;

        if (distance < this.settings.separationDistance) {
          const diff = {
            x: -dx / (distance + 0.01),
            y: -dy / (distance + 0.01)
          };
          separation.x += diff.x;
          separation.y += diff.y;
          separationCount++;
        }
      }
    }

    if (cohesionCount > 0) {
      cohesion.x /= cohesionCount;
      cohesion.y /= cohesionCount;
      cohesion.x -= boid.position.x;
      cohesion.y -= boid.position.y;

      const cohesionMag = Math.sqrt(cohesion.x ** 2 + cohesion.y ** 2);
      if (cohesionMag > 0) {
        cohesion.x = (cohesion.x / cohesionMag) * boid.maxSpeed - boid.velocity.x;
        cohesion.y = (cohesion.y / cohesionMag) * boid.maxSpeed - boid.velocity.y;

        const cohesionForceMag = Math.sqrt(cohesion.x ** 2 + cohesion.y ** 2);
        if (cohesionForceMag > boid.maxForce) {
          cohesion.x = (cohesion.x / cohesionForceMag) * boid.maxForce;
          cohesion.y = (cohesion.y / cohesionForceMag) * boid.maxForce;
        }

        boid.applyForce({
          x: cohesion.x * this.settings.cohesionWeight,
          y: cohesion.y * this.settings.cohesionWeight
        });
      }
    }

    if (alignmentCount > 0) {
      alignment.x /= alignmentCount;
      alignment.y /= alignmentCount;

      const alignmentMag = Math.sqrt(alignment.x ** 2 + alignment.y ** 2);
      if (alignmentMag > 0) {
        alignment.x = (alignment.x / alignmentMag) * boid.maxSpeed - boid.velocity.x;
        alignment.y = (alignment.y / alignmentMag) * boid.maxSpeed - boid.velocity.y;

        const alignmentForceMag = Math.sqrt(alignment.x ** 2 + alignment.y ** 2);
        if (alignmentForceMag > boid.maxForce) {
          alignment.x = (alignment.x / alignmentForceMag) * boid.maxForce;
          alignment.y = (alignment.y / alignmentForceMag) * boid.maxForce;
        }

        boid.applyForce({
          x: alignment.x * this.settings.alignmentWeight,
          y: alignment.y * this.settings.alignmentWeight,
        });
      }
    }

    if (separationCount > 0) {
      separation.x /= separationCount;
      separation.y /= separationCount;

      const separationMag = Math.sqrt(separation.x ** 2 + separation.y ** 2);
      if (separationMag > 0) {
        separation.x = (separation.x / separationMag) * boid.maxSpeed - boid.velocity.x;
        separation.y = (separation.y / separationMag) * boid.maxSpeed - boid.velocity.y;

        const separationForceMag = Math.sqrt(separation.x ** 2 + separation.y ** 2);
        if (separationForceMag > boid.maxForce) {
          separation.x = (separation.x / separationForceMag) * boid.maxForce;
          separation.y = (separation.y / separationForceMag) * boid.maxForce;
        }

        boid.applyForce({
          x: separation.x * this.settings.separationWeight,
          y: separation.y * this.settings.separationWeight,
        });
      }
    }
  }
}
