import Flock from "./Flock";

export default class UIController {
  private flock: Flock;
  private settings: Settings;

  constructor(flock: Flock, settings: Settings) {
    this.flock = flock;
    this.settings = settings;
    this.setupEventListeners();
  }

  private setupEventListeners() {
    const maxSpeedSlider = document.querySelector<HTMLInputElement>("#maxSpeed")!;
    const maxForceSlider = document.querySelector<HTMLInputElement>("#maxForce")!;
    const perceptionRadiusSlider = document.querySelector<HTMLInputElement>("#perceptionRadius")!;
    const separationDistanceSlider = document.querySelector<HTMLInputElement>("#separationDistance")!;
    const cohesionWeightSlider = document.querySelector<HTMLInputElement>("#cohesionWeight")!;
    const alignmentWeightSlider = document.querySelector<HTMLInputElement>("#alignmentWeight")!;
    const separationWeightSlider = document.querySelector<HTMLInputElement>("#separationWeight")!;
    const randomnessSlider = document.querySelector<HTMLInputElement>("#randomness")!;

    maxSpeedSlider.addEventListener("input", () => {
      this.flock.boids.forEach((boid) => (boid.maxSpeed = Number(maxSpeedSlider.value)));
      this.settings.maxSpeed = Number(maxSpeedSlider.value);
    });
    maxForceSlider.addEventListener("input", () => {
      this.flock.boids.forEach((boid) => (boid.maxForce = Number(maxForceSlider.value)));
      this.settings.maxForce = Number(maxForceSlider.value);
    });
    perceptionRadiusSlider.addEventListener("input", () => {
      this.settings.perceptionRadius = Number(perceptionRadiusSlider.value);
    });
    separationDistanceSlider.addEventListener("input", () => {
      this.settings.separationDistance = Number(separationDistanceSlider.value);
    });
    cohesionWeightSlider.addEventListener("input", () => {
      this.settings.cohesionWeight = Number(cohesionWeightSlider.value);
    });
    alignmentWeightSlider.addEventListener("input", () => {
      this.settings.alignmentWeight = Number(alignmentWeightSlider.value);
    });
    separationWeightSlider.addEventListener("input", () => {
      this.settings.separationWeight = Number(separationWeightSlider.value);
    });
    randomnessSlider.addEventListener("input", () => {
      this.settings.randomness = Number(randomnessSlider.value);
    });
  }

  get wrapAround(): boolean {
    return document.querySelector<HTMLInputElement>("#wrapAround")!.checked;
  }
}
