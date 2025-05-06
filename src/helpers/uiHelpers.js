import handleSlider from './handleSlider';
import PhysicsBody from './physicsBody';
function updatePlanetWithInfoBoxData() {
  const massInfoEl = this.$refs.mass;
  const scaleInfoEl = this.$refs.scale;
  const nameInfoEl = this.$refs.name;
  const densityInfoEl = this.$refs.density;
  const positionInfoEl = this.$refs.position;
  const velocityInfoEl = this.$refs.velocity;

  if ((this.massInput.value || {}).length > 0) {
    const exponentSeparator = 'e+';
    const massString = String(this.currentlyOpenBody.mass);
    let exp = 1;

    if (massString.includes(exponentSeparator)) {
      const expString = massString.split(exponentSeparator)[1];

      exp = parseInt(expString, 10);
    } else {
      exp = massString.length;
    }

    this.currentlyOpenBody.mass = parseInt(this.massInput.value, 10) * 10 ** exp;
    massInfoEl
      .getElementsByClassName('value')[0].innerHTML = `${Number(this.currentlyOpenBody.mass.toPrecision(5))} kg`;
    this.massInput.value = '';
  }

  if ((this.scaleInput.value || {}).length > 0) {
    this.currentlyOpenBody.scale = parseFloat(this.scaleInput.value, 10);
    scaleInfoEl
      .getElementsByClassName('value')[0].innerHTML = `${Number(this.currentlyOpenBody.scale)}`;
    this.scaleInput.value = '';
  }

  if ((this.nameInput.value || {}).length > 0) {
    this.currentlyOpenBody.name = this.nameInput.value;
    nameInfoEl
      .getElementsByClassName('value')[0].innerHTML = `${Number(this.currentlyOpenBody.name)}`;
    this.nameInput.value = '';
  }

  if ((this.densityInput.value || {}).length > 0) {
    this.currentlyOpenBody.density = parseFloat(this.densityInput.value, 10);
    densityInfoEl
      .getElementsByClassName('value')[0].innerHTML = `${Number(this.currentlyOpenBody.density)}`;
    this.densityInput.value = '';
  }

  if ((this.positionXInput.value || {}).length > 0) {
    this.currentlyOpenBody.position.x = parseFloat(this.positionXInput.value, 10) * 10 ** 9;
    positionInfoEl
      .getElementsByClassName('value')[0].innerHTML = `
        x: ${Number(this.currentlyOpenBody.position.x.toPrecision(5) / 10 ** 9)} million km<br>
        y: ${Number(this.currentlyOpenBody.position.y.toPrecision(5) / 10 ** 9)} million km`;
    this.positionXInput.value = '';
  }
  if ((this.positionYInput.value || {}).length > 0) {
    this.currentlyOpenBody.position.y = parseFloat(this.positionYInput.value, 10) * 1000;
    positionInfoEl
      .getElementsByClassName('value')[0].innerHTML = `
        x: ${Number(this.currentlyOpenBody.position.x.toPrecision(5) / 10 ** 9)} million km<br>
        y: ${Number(this.currentlyOpenBody.position.y.toPrecision(5) / 10 ** 9)} million kn`;
    this.positionYInput.value = '';
  }

  if ((this.velocityXInput.value || {}).length > 0) {
    this.currentlyOpenBody.velocity.x = parseFloat(this.velocityXInput.value, 10) * 1000;
    velocityInfoEl
      .getElementsByClassName('value')[0].innerHTML = `
       &nbsp; &nbsp; x: ${Number(this.currentlyOpenBody.velocity.x.toPrecision(5) / 1000)} km/s<br>
       &nbsp; &nbsp; y: ${Number(this.currentlyOpenBody.velocity.y.toPrecision(5) / 1000)} km/s`;
    this.velocityXInput.value = '';
  }

  if ((this.velocityYInput.value || {}).length > 0) {
    this.currentlyOpenBody.velocity.y = parseFloat(this.velocityYInput.value, 10) * 1000;
    velocityInfoEl
      .getElementsByClassName('value')[0].innerHTML = `
        &nbsp; &nbsp; x: ${Number(this.currentlyOpenBody.velocity.x.toPrecision(5) / 1000)} km/s<br>
        &nbsp; &nbsp; y: ${Number(this.currentlyOpenBody.velocity.y.toPrecision(5) / 1000)} km/s`;
    this.velocityYInput.value = '';
  }
}

export default {
  handleTimeSlider(timeSliderCallback) {
    const timeSliderEl = document.getElementById('time-slider');
    return handleSlider(timeSliderCallback, timeSliderEl);
  },

  handleScenarioSelect(initialScenario, scenarioKeys, scenarioSelectCallback) {
    const scenarioSelectEl = document.getElementById('scenario-select');
    scenarioSelectEl.value = initialScenario;
    scenarioSelectEl.addEventListener('click', (event) => event.preventDefault());
    scenarioSelectEl.addEventListener('change', scenarioSelectCallback);

    scenarioKeys.forEach((scenarioKey) => {
      const opt = document.createElement('option');
      opt.value = scenarioKey;
      opt.innerHTML = scenarioKey;
      scenarioSelectEl.appendChild(opt);
    });
  },

  handleInfoBoxClicked(parentEvent) {
    isInfoBoxClicked = true;
    handlePlanetInfoInputClicks(parentEvent);
    updatePlanetWithInfoBoxData();
  },

  getDistance(...args) {
    return Math.hypot(args[2] - args[0], args[3] - args[1]);
  },

  getMousePosition(event) {
    const mouse = new Vector3();
    event.preventDefault();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    return mouse;
  },

  manageRaycasterIntersections(mouse, scene, camera) {
    // camera.updateMatrixWorld();
    raycaster.setFromCamera(mouse, camera);
    return raycaster.intersectObjects(scene.children);
  },

  onCanvasClick(parentEvent, isInfoBoxOpen, isInfoBoxClicked) {
    if (isInfoBoxOpen && !isInfoBoxClicked) {
      return closePlanetInfoBox();
    }

    isInfoBoxClicked = false;
    updatePlanetWithInfoBoxData();

    const { scene } = simulation;

    const { camera } = simulation;
    const mousePosition = getMousePosition(parentEvent);
    const raycastIntersections = manageRaycasterIntersections(mousePosition, scene, camera);
    const { physicsBodies } = simulation.gravitySimulation;

    const [clickedObject] = raycastIntersections
      .filter((sceneObject) => sceneObject.object.name.includes('Planet'));

    if (typeof clickedObject !== 'object') {
      return false;
    }

    const OBJECT_NAME_PREFACE = PhysicsBody.getObjectNamePreface();

    const clickedSceneObjectName = clickedObject.object.name.replace(OBJECT_NAME_PREFACE, '');

    const clickedBody = physicsBodies
      .find((body) => body.name === clickedSceneObjectName);

    massHandler = {};

    if (typeof clickedBody === 'object' && !isInfoBoxOpen) {
      return openPlanetInfoBox(clickedBody, parentEvent);
    }

    return null;
  },

};
