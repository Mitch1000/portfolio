import { Vector3 } from 'three';
import handleSlider from './handleSlider';
import PhysicsBody from './physicsBody';
import Denormalizer from './denormalizer';
import GravityCalculator from './gravityCalculator';
import planetData from './planetData';

class GravitySimulation {
  constructor({
    gravitationConstant = 6.6738410 * (10 ** -11),
    currentScenario = 'Solar System',
    distanceUnitMultiplier = 10 ** 9, // Meters
    massUnitMultiplier = 10 ** 24, // Kilograms
    timeScale = 10,
    intitialTimeScale = timeScale,
    yearCount = new Date().getFullYear(),
    isYearCounted = true,
    isScaled = true,
    drawDistance = 50000,
    offset = new Vector3({ x: 0, y: 0, z: 0 }),
    resetTimeSlider = () => {},
    scene,
    scene2,
  }) {
    this.gravitationConstant = gravitationConstant;
    this.currentScenario = currentScenario;
    this.distanceUnitMultiplier = distanceUnitMultiplier;
    this.massUnitMultiplier = massUnitMultiplier;
    this.timeScale = timeScale;
    this.intitialTimeScale = intitialTimeScale;
    this.yearCount = yearCount;
    this.isYearCounted = isYearCounted;
    this.isScaled = isScaled;
    this.offset = offset;
    this.drawDistance = drawDistance;
    this.isScaled = isScaled;
    this.resetTimeSlider = resetTimeSlider;
    this.scene = scene;
    this.scene2 = scene2;

    this.physicsBodies = this.generatePhysicsBodies(planetData, this.currentScenario);

    const diagramScale = {
      x: ((window.innerWidth * 2) * distanceUnitMultiplier),
      y: ((window.innerHeight * 2) * distanceUnitMultiplier),
      z: ((window.innerHeight * 2) * distanceUnitMultiplier),
    };
    const windowScale = {
      x: window.innerWidth,
      y: window.innerHeight,
      z: window.innerHeight,
    };

    this.setInitialTimeScale(currentScenario);
    this.denormalizer = new Denormalizer(windowScale, diagramScale);

    this.drawPhysicsBodies(this.physicsBodies);
  }

  static removePhysicsBodies(physicsBodies) {
    physicsBodies.forEach((body) => body.remove());
  }

  drawPhysicsBodies(physicsBodies) {
    physicsBodies.forEach((body) => body.draw(this.denormalizer, this.isScaled));
    physicsBodies
      .forEach((body) => body.drawForceVector(this.denormalizer, this.drawDistance));
  }

  updateTimeConstant(sliderValue) {
    const { intitialTimeScale } = this;

    const getTimeScale = () => (Math.exp(1) * sliderValue * (intitialTimeScale / 35) * 5);

    this.timeScale = getTimeScale();
  }

  updateCurrentScenario(event) {
    this.currentScenario = event.currentTarget.value;

    // Reset sliders
    this.resetTimeSlider();

    this.setInitialTimeScale(this.currentScenario);

    GravitySimulation.removePhysicsBodies(this.physicsBodies);
    this.physicsBodies = [];
    this.physicsBodies = this.generatePhysicsBodies(planetData, this.currentScenario);

    this.drawPhysicsBodies(this.physicsBodies);
  }

  static getScenariosList() {
    return Object.keys(planetData);
  }

  generatePhysicsBodies(bodyData, scenarioKey) {
    return bodyData[scenarioKey].map((data) => {
      const planet = JSON.parse(JSON.stringify(data));
      planet.mass *= this.massUnitMultiplier;
      planet.position.x *= this.distanceUnitMultiplier;
      planet.position.y *= this.distanceUnitMultiplier;
      planet.position.z *= this.distanceUnitMultiplier;
      planet.scene = this.scene;
      planet.scene2 = this.scene2;
      planet.offsetX = this.offset.x;
      planet.offsetY = this.offset.y;

      return new PhysicsBody(planet);
    });
  }

  handleYearCount() {
    const earth = this.physicsBodies.find((body) => body.name === 'Earth');
    const sun = this.physicsBodies.find((body) => body.name === 'Sun');
    const earthPosition = ((earth || {}).position || {});
    const sunPosition = ((sun || {}).position || {});
    const isInXWindow = earthPosition.x > sunPosition.x;
    if (isInXWindow && !this.isYearCounted) {
      this.yearCount += 1;
      this.isYearCounted = true;
      const yearEl = document.getElementById('year-count')
        .getElementsByTagName('span')[0];
      yearEl.innerHTML = this.yearCount;
    }
    if (earthPosition.x < sunPosition.x) {
      this.isYearCounted = false;
    }
  }

  setInitialTimeScale(scenarioKey) {
    if (scenarioKey === 'Chaotic') {
      this.timeScale = 2500;
    } else {
      this.timeScale = 10;
    }
    this.intitialTimeScale = this.timeScale;
  }

  animate() {
    if (this.physicsBodies.length <= 0) { return; }

    GravityCalculator.calculateBodyGravity({
      physicsBodies: this.physicsBodies,
      timeScale: this.timeScale,
      gravitationConstant: this.gravitationConstant,
    });

    this.handleYearCount();

    const scaleEl = document.getElementById('scale-checkbox').getElementsByTagName('input')[0];
    this.isScaled = scaleEl.checked;

    this.physicsBodies.forEach((body) => body.updatePosition(this.denormalizer, this.isScaled));
    this.physicsBodies.forEach((body) => body.updateForceLines(this.denormalizer));
  }
}

export default GravitySimulation;
