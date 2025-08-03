import Boid from "./Boid";
import QuadTree from "./QuadTree";

export default class Flock {
  boids: Boid[];
  settings: Settings;
  private readonly BOIDS_PER_LEAF = 4;

  constructor(canvas: HTMLCanvasElement, count: number, settings: Settings) {
    this.boids = Array.from(
      { length: count }, 
      () => new Boid(canvas, settings.maxSpeed, settings.maxForce)
    );
    this.settings = { ...settings };
  }

  update(canvas: HTMLCanvasElement, boundaryHandler: (boid: Boid, canvas: HTMLCanvasElement) => void) {
    const quadTree = new QuadTree(
      { x: 0, y: 0, width: canvas.width, height: canvas.height },
      this.BOIDS_PER_LEAF
    );

    for (const boid of this.boids) {
      quadTree.insert({ x: boid.position.x, y: boid.position.y, boid });
    }

    for (const boid of this.boids) {
      this.flock(boid, quadTree);
      boid.update(this.settings);
      boundaryHandler(boid, canvas);
    }
  }

  flock(boid: Boid, quadTree: QuadTree) {
    const range = {
      x: boid.position.x - this.settings.perceptionRadius,
      y: boid.position.y - this.settings.perceptionRadius,
      width: this.settings.perceptionRadius * 2,
      height: this.settings.perceptionRadius * 2,
    };
    const neighbors = quadTree.query(range);

    const cohesion = { x: 0, y: 0 };
    const alignment = { x: 0, y: 0 };
    const separation = { x: 0, y: 0 };
    let cohesionCount = 0;
    let alignmentCount = 0;
    let separationCount = 0;

    for (const neighbor of neighbors) {
      if (neighbor.boid === boid) continue;

      const dx = neighbor.x - boid.position.x;
      const dy = neighbor.y - boid.position.y;
      const distance = Math.sqrt(dx ** 2 + dy ** 2);

      if (distance < this.settings.perceptionRadius) {
        cohesion.x += neighbor.x;
        cohesion.y += neighbor.y;
        cohesionCount++;
        
        alignment.x += neighbor.boid.velocity.x;
        alignment.y += neighbor.boid.velocity.y;
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
