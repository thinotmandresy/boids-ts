import Flock from "./Flock";
import Renderer from "./Renderer";
import "./style.css";
import { wrapAround } from "./utils/boundary-handlers";

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
  randomness: 0.05,
};

const flock = new Flock(canvas, 100, settings);
const renderer = new Renderer(ctx);

(function animate() {
  const boundaryHandler = wrapAround;
  flock.update(canvas, boundaryHandler);
  renderer.draw(flock.boids);
  requestAnimationFrame(animate);
})();

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
