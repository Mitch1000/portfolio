import handleSlider from './handleSlider';
import PhysicsBody from './physicsBody';

import { Vector3 } from 'three';
let currentEvent = { clientX: 0, clientY: 0, buttons: 0 };

function onPlanetClick({ simulation, clickedObject }) {
  const OBJECT_NAME_PREFACE = PhysicsBody.getObjectNamePreface();

  const clickedSceneObjectName = clickedObject.object.name.replace(OBJECT_NAME_PREFACE, '');

  const { physicsBodies } = simulation.gravitySimulation;
  const clickedBody = physicsBodies
    .find((body) => body.name === clickedSceneObjectName);

  if (typeof clickedBody !== 'object') {
    return null;
  }

  planetClickHandler(clickedBody, simulation);

  return clickedBody;
}

function getMousePositionFromEvent(event) {
  const mouse = new Vector3();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  return mouse;
}

let originalYSpeed = null;
function onTextClick({ simulation, clickedObject }) {
  if (typeof simulation.introText !== 'object') {
    return null;
  }

  //TODO: Make this more extensible
  if (typeof simulation.introText.header !== 'object') {
    return null;
  }
  if (originalYSpeed === null) {
    originalYSpeed = simulation.introText.header.ySpeed;
  }

  let textGroup = simulation.introText.header;

  if (clickedObject.object.name.includes('Subheader') && typeof simulation.introText.subHeader === 'object') {
    textGroup = simulation.introText.subHeader;
  }


  textGroup.ySpeed = 0.12;
  setTimeout(() => {
    textGroup.ySpeed = originalYSpeed;
  }, (50 * 12) + 1000);

  return null;
}

let planetClickHandler = () => {};
export function setPlanetClickHandler(clickHandler) {
  planetClickHandler = clickHandler;
  return planetClickHandler;
}

let characterClickHandler = () => {};
export function setCharacterClickHandler(clickHandler) {
  characterClickHandler = clickHandler;
  return characterClickHandler;
}

export function handleTimeSlider(timeSliderCallback) {
  const timeSliderEl = document.getElementById('time-slider');
  return handleSlider(timeSliderCallback, timeSliderEl);
}

export function onClick({ parentEvent, simulation, clickedObjects }) {
  const [clickedObject] = clickedObjects;

  if (typeof clickedObject !== 'object') {
    return null;
  }

  const objectName = clickedObject.object.name;
  if (objectName.includes('Text')) {
    return onTextClick({ simulation, clickedObject });
  }

  if (objectName.includes('Planet')) {
    return onPlanetClick({ simulation, clickedObject, parentEvent });
  }

  if (objectName.includes('Character')) {
    return characterClickHandler({ simulation });
  }

  return null;
  // updatePlanetWithInfoBoxData();
}

export function handleScenarioSelect(initialScenario, scenarioKeys, scenarioSelectCallback) {
  const scenarioSelectEl = document.getElementById('scenario-select');

  if (typeof scenarioSelectEl !== 'object' || scenarioSelectEl === null) {
    return;
  }

  scenarioSelectEl.value = initialScenario;
  scenarioSelectEl.addEventListener('click', (event) => event.preventDefault());
  scenarioSelectEl.addEventListener('change', scenarioSelectCallback);

  scenarioKeys.forEach((scenarioKey) => {
    const opt = document.createElement('option');
    opt.value = scenarioKey;
    opt.innerHTML = scenarioKey;
    scenarioSelectEl.appendChild(opt);
  });
};

export function getDistance(...args) {
  return Math.hypot(args[2] - args[0], args[3] - args[1]);
}


export function setCurrentEvent(event) {
  currentEvent = event;
  return event;
}

export function getMouseData() {
  return currentEvent;
}

export function handleCursor({ simulation, raycaster }) {
  const { scene, camera } = simulation;
  if (typeof scene !== 'object' || typeof camera !== 'object') {
    return;
  }

  const mousePos = getMousePositionFromEvent(currentEvent);
  const raycastIntersections = manageRaycasterIntersections(mousePos, scene, camera, raycaster);
  const clickableInteractions = raycastIntersections.filter(object =>  {
    const clickedObject = object.object;
    if (typeof clickedObject !== 'object') {
      return false;
    }

    if (typeof clickedObject.name !== 'string') {
      return false;
    }
    return !clickedObject.name.includes('Line');
  });

  const MOUSE_CLICK = 1 << 0;
  const isLeftClick = currentEvent.buttons & MOUSE_CLICK;
  if (isLeftClick || currentEvent.pointerType === "touch") {
    onClick({ parentEvent: currentEvent, simulation, clickedObjects: clickableInteractions });
    return;
  }


  if (clickableInteractions.length > 0) {
    return document.body.style.cursor = 'pointer';
  }  
}

export function manageRaycasterIntersections(mouse, scene, camera, raycaster) {
  raycaster.setFromCamera(mouse, camera);
  return raycaster.intersectObjects(scene.children);
}

// function updatePlanetWithInfoBoxData() {
//   const massInfoEl = this.$refs.mass;
//   const scaleInfoEl = this.$refs.scale;
//   const nameInfoEl = this.$refs.name;
//   const densityInfoEl = this.$refs.density;
//   const positionInfoEl = this.$refs.position;
//   const velocityInfoEl = this.$refs.velocity;
// 
//   if ((this.massInput.value || {}).length > 0) {
//     const exponentSeparator = 'e+';
//     const massString = String(this.currentlyOpenBody.mass);
//     let exp = 1;
// 
//     if (massString.includes(exponentSeparator)) {
//       const expString = massString.split(exponentSeparator)[1];
// 
//       exp = parseInt(expString, 10);
//     } else {
//       exp = massString.length;
//     }
// 
//     this.currentlyOpenBody.mass = parseInt(this.massInput.value, 10) * 10 ** exp;
//     massInfoEl
//       .getElementsByClassName('value')[0].innerHTML = `${Number(this.currentlyOpenBody.mass.toPrecision(5))} kg`;
//     this.massInput.value = '';
//   }
// 
//   if ((this.scaleInput.value || {}).length > 0) {
//     this.currentlyOpenBody.scale = parseFloat(this.scaleInput.value, 10);
//     scaleInfoEl
//       .getElementsByClassName('value')[0].innerHTML = `${Number(this.currentlyOpenBody.scale)}`;
//     this.scaleInput.value = '';
//   }
// 
//   if ((this.nameInput.value || {}).length > 0) {
//     this.currentlyOpenBody.name = this.nameInput.value;
//     nameInfoEl
//       .getElementsByClassName('value')[0].innerHTML = `${Number(this.currentlyOpenBody.name)}`;
//     this.nameInput.value = '';
//   }
// 
//   if ((this.densityInput.value || {}).length > 0) {
//     this.currentlyOpenBody.density = parseFloat(this.densityInput.value, 10);
//     densityInfoEl
//       .getElementsByClassName('value')[0].innerHTML = `${Number(this.currentlyOpenBody.density)}`;
//     this.densityInput.value = '';
//   }
// 
//   if ((this.positionXInput.value || {}).length > 0) {
//     this.currentlyOpenBody.position.x = parseFloat(this.positionXInput.value, 10) * 10 ** 9;
//     positionInfoEl
//       .getElementsByClassName('value')[0].innerHTML = `
//         x: ${Number(this.currentlyOpenBody.position.x.toPrecision(5) / 10 ** 9)} million km<br>
//         y: ${Number(this.currentlyOpenBody.position.y.toPrecision(5) / 10 ** 9)} million km`;
//     this.positionXInput.value = '';
//   }
//   if ((this.positionYInput.value || {}).length > 0) {
//     this.currentlyOpenBody.position.y = parseFloat(this.positionYInput.value, 10) * 1000;
//     positionInfoEl
//       .getElementsByClassName('value')[0].innerHTML = `
//         x: ${Number(this.currentlyOpenBody.position.x.toPrecision(5) / 10 ** 9)} million km<br>
//         y: ${Number(this.currentlyOpenBody.position.y.toPrecision(5) / 10 ** 9)} million kn`;
//     this.positionYInput.value = '';
//   }
// 
//   if ((this.velocityXInput.value || {}).length > 0) {
//     this.currentlyOpenBody.velocity.x = parseFloat(this.velocityXInput.value, 10) * 1000;
//     velocityInfoEl
//       .getElementsByClassName('value')[0].innerHTML = `
//        &nbsp; &nbsp; x: ${Number(this.currentlyOpenBody.velocity.x.toPrecision(5) / 1000)} km/s<br>
//        &nbsp; &nbsp; y: ${Number(this.currentlyOpenBody.velocity.y.toPrecision(5) / 1000)} km/s`;
//     this.velocityXInput.value = '';
//   }
// 
//   if ((this.velocityYInput.value || {}).length > 0) {
//     this.currentlyOpenBody.velocity.y = parseFloat(this.velocityYInput.value, 10) * 1000;
//     velocityInfoEl
//       .getElementsByClassName('value')[0].innerHTML = `
//         &nbsp; &nbsp; x: ${Number(this.currentlyOpenBody.velocity.x.toPrecision(5) / 1000)} km/s<br>
//         &nbsp; &nbsp; y: ${Number(this.currentlyOpenBody.velocity.y.toPrecision(5) / 1000)} km/s`;
//     this.velocityYInput.value = '';
//   }
// }

// export function handleInfoBoxClicked(parentEvent) {
//   isInfoBoxClicked = true;
//   handlePlanetInfoInputClicks(parentEvent);
//   // updatePlanetWithInfoBoxData();
// }


