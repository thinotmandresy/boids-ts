import Flock from "./Flock";
import "./style.css";

const canvas = document.querySelector<HTMLCanvasElement>("canvas#boids")!;
const ctx = canvas.getContext("2d")!;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const settings: Settings = {
  maxSpeed: 2,
  maxForce: 0.1,
  perceptionRadius: 100,
  separationDistance: 30,
  cohesionWeight: 0.05,
  alignmentWeight: 0.1,
  separationWeight: 0.15,
};

const flock = new Flock(canvas, 100, settings);

(function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  flock.update(canvas);
  flock.draw(ctx);
  requestAnimationFrame(animate);
})();

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
