import P5 from 'p5';
import rungeKutta from 'runge-kutta';
import handleSlider from './handleSlider';
import PhysicsBody from './physicsBody';
import Denormalizer from './denormalizer';
import Character from './character';
import planetData from './planetData';

// N⋅m^2⋅kg^2
// Newtons, meter, kilogram - These are the units we are using.
// For time we are using seconds.
const gravitationConstant = 6.6738410 * (10 ** -11);
let canvas = {};
let currentScenario = 'Solar System';
let physicsBodies = [];
let zoom = 0.01;
const distanceUnitMultiplier = 10 ** 9; // Meters
const massUnitMultiplier = 10 ** 24; // Kilograms
let timeScale = 10;
let intitialTimeScale = timeScale;
let yearCount = new Date().getFullYear();
let isYearCounted = true;
let isScaled = true;
let onMouseClick = null;
let character = {};
const shiftValue = { x: 1.5, y: 1.5 };

function generatePhysicsBodies(scenarioKey) {
  physicsBodies = planetData[scenarioKey].map((data) => {
    const planet = JSON.parse(JSON.stringify(data));
    planet.mass *= massUnitMultiplier;
    planet.position.x *= distanceUnitMultiplier;
    planet.position.y *= distanceUnitMultiplier;

    return new PhysicsBody(planet);
  });
  return physicsBodies;
}

function handleYearCount() {
  const earth = physicsBodies.find((body) => body.name === 'Earth');
  const sun = physicsBodies.find((body) => body.name === 'Sun');
  const earthPosition = ((earth || {}).position || {});
  const sunPosition = ((sun || {}).position || {});
  const isInXWindow = earthPosition.x > sunPosition.x;
  if (isInXWindow && !isYearCounted) {
    yearCount += 1;
    isYearCounted = true;
    const yearEl = document.getElementById('year-count')
      .getElementsByTagName('span')[0];
    yearEl.innerHTML = yearCount;
  }
  if (earthPosition.x < sunPosition.x) {
    isYearCounted = false;
  }
}

function setInitialTimeScale(scenarioKey) {
  if (scenarioKey === 'Chaotic') {
    timeScale = 2500;
  } else {
    timeScale = 10;
  }
  intitialTimeScale = timeScale;
}

const windowScale = {
  x: window.innerWidth,
  y: window.innerHeight,
  z: window.innerHeight,
};
const diagramScale = {
  x: ((window.innerWidth * 2) * distanceUnitMultiplier),
  y: ((window.innerHeight * 2) * distanceUnitMultiplier),
  z: ((window.innerHeight * 2) * distanceUnitMultiplier),
};

const denormalizer = new Denormalizer(windowScale, diagramScale);
let isOrbiting = false;

function code(p5) {
  generatePhysicsBodies(currentScenario);
  setInitialTimeScale(currentScenario);

  return {
    setup() {
      const cnv = p5.createCanvas(
        window.innerWidth * shiftValue.x,
        window.innerHeight * shiftValue.y,
        p5.WEBGL,
      );
      canvas = cnv.canvas;

      const updateTimeConstant = (sliderValue, initialPosition, sliderEl) => {
        const getTimeScale = () => timeScale
          + (Math.exp(1) * sliderValue * (intitialTimeScale / 35) * 5);

        if (initialPosition < sliderEl.getBoundingClientRect().top) {
          timeScale = Math.min(timeScale, intitialTimeScale);

          timeScale = Math.max(timeScale + ((sliderValue * (intitialTimeScale / 6)) / 10), 0);
          return;
        }
        timeScale = getTimeScale();
      };

      const updateZoom = (sliderValue) => {
        zoom += 0.01 * sliderValue;
      };

      const zoomSliderEl = document.getElementById('zoom-slider');

      const zoomHandler = handleSlider(updateZoom, zoomSliderEl);

      const timeSliderEl = document.getElementById('time-slider');
      const timeHandler = handleSlider(updateTimeConstant, timeSliderEl);

      const scenarioSelectEl = document.getElementById('scenario-select');

      Object.keys(planetData).forEach((scenarioKey) => {
        const opt = document.createElement('option');
        opt.value = scenarioKey;
        opt.innerHTML = scenarioKey;
        scenarioSelectEl.appendChild(opt);
      });

      scenarioSelectEl.value = currentScenario;
      scenarioSelectEl.addEventListener('click', (event) => event.preventDefault());

      const handleScenarioSelect = (event) => {
        currentScenario = event.currentTarget.value;

        // Reset sliders
        timeSliderEl.style.transform = 'translateY(0px)';
        zoomSliderEl.style.transform = 'translateY(0px)';
        timeHandler.currentPosition = 0;
        zoomHandler.currentPosition = 0;

        setInitialTimeScale(currentScenario);
        generatePhysicsBodies(currentScenario);
      };

      scenarioSelectEl.addEventListener('change', handleScenarioSelect);

      p5.pixelDensity(4);
      p5.noStroke();

      p5.background(8, 4, 4);

      physicsBodies.forEach((body) => body.draw(p5, denormalizer, isScaled));
    },

    draw() {
      console.log('character', character);

      p5.smooth();
      p5.frameRate(60);
      if (canvas.style.position !== 'absolute') {
        canvas = document.getElementById('defaultCanvas0');
        canvas.addEventListener('click', onMouseClick);

        canvas.style.position = 'absolute';
        const top = (shiftValue.y - 1) * 100;
        canvas.style.top = `-${top}%`;
        canvas.style.left = '0';
      }
      const variableCount = 4;

      const getInitial = (bodies) => {
        const dataArray = [];
        bodies.forEach((body, index) => {
          dataArray[index * variableCount] = body.position.x;
          dataArray[index * variableCount + 1] = body.position.y;
          dataArray[index * variableCount + 2] = body.velocity.x;
          dataArray[index * variableCount + 3] = body.velocity.y;
        });
        return dataArray;
      };

      const updateBodies = (y) => {
        let bodyIndex = 0;
        y.forEach((value, index) => {
          if (index % variableCount !== 0) { return; }

          const bodyDataIndex = bodyIndex * variableCount;
          const body = physicsBodies[bodyIndex];
          if (typeof body !== 'object') {
            console.warn('THIS BODY WAS NOT DEFINED'); // eslint-disable-line
          }
          body.position.x = y[bodyDataIndex];
          body.position.y = y[bodyDataIndex + 1];
          body.velocity.x = y[bodyDataIndex + 2];
          body.velocity.y = y[bodyDataIndex + 3];
          bodyIndex += 1;
        });
      };

      const differentialEquation = (t, y) => {
        updateBodies(y);
        const data = [];
        physicsBodies.forEach((b, index) => {
          const body = b;
          const a = body.getAcceleration(physicsBodies, gravitationConstant);

          const v = body.getVelocityWithDelta(1, a);
          body.velocity = v;

          body.position.x += v.x;
          body.position.y += v.y;

          body.acceleration = a;
          data[(index * variableCount)] = v.x;
          data[(index * variableCount) + 1] = v.y;
          data[(index * variableCount) + 2] = a.x;
          data[(index * variableCount) + 3] = a.y;
        });

        return data;
      };

      const initialConditions = getInitial(physicsBodies);
      const range = [0, Math.max(1000 * parseInt(timeScale, 10), 1000)];

      const steps = Math.max(100 * parseInt(timeScale, 10), 20);
      rungeKutta(differentialEquation, initialConditions, range, steps);

      handleYearCount();

      const scaleEl = document.getElementById('scale-checkbox').getElementsByTagName('input')[0];
      isScaled = scaleEl.checked;

      p5.background(8, 4, 4);
      p5.noStroke();
      p5.pixelDensity(4);
      if (isOrbiting) {
        p5.orbitControl();
      }

      p5.scale(zoom + -1);
      p5.ambientLight(128);

      physicsBodies.forEach((body) => body.drawForceVector(p5, denormalizer));

      physicsBodies.forEach((body) => body.draw(p5, denormalizer, isScaled));

      character.animate();
    },

    keyPressed() {
      if (p5.keyCode === p5.SHIFT) {
        isOrbiting = true;
        return;
      }
      isOrbiting = false;
    },
    keyReleased() {
      isOrbiting = false;
    },
  };
}

function main(onMouseClickCallback) {
  onMouseClick = onMouseClickCallback;
  const canvas1 = (p5) => Object.assign(p5, code(p5));

  return {
    p5: new P5(canvas1),
    getPhysicsBodies: () => physicsBodies,
    getIsScaled: () => isScaled,
    getDenormalizer: () => denormalizer,
    getZoom: () => zoom,
    getShiftValue: () => shiftValue,
  };
}

export default main;
