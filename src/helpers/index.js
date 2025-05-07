import * as THREE from 'three';
import { reversePainterSortStable } from '@pmndrs/uikit'

import SceneHelper from './sceneHelper';
import { handleCursor } from './uiHelpers';

const raycaster = new THREE.Raycaster();

// N⋅m^2⋅kg^2
// Newtons, meter, kilogram - These are the units we are using.
// For time we are using seconds.
let sceneHelper = {};
const drawDistance = 50000;
let yearCountUpdater = () => {};

const clock = new THREE.Clock();

async function setup() {
  sceneHelper = new SceneHelper(drawDistance);
  sceneHelper.initScene();
  const { uiScene, scene } = sceneHelper;
  scene.background = null;
}

function animate() {
  requestAnimationFrame(animate);
  const { character, introText, gravitySimulation } = sceneHelper;

  const deltaTime = clock.getDelta();

  sceneHelper.setCanvasPositionOnInitialAnimate();

  character.animate(deltaTime);

  introText.animate();

  gravitySimulation.animate(yearCountUpdater);


  handleCursor({ simulation: sceneHelper, raycaster })

  sceneHelper.renderer.setTransparentSort(reversePainterSortStable);
  sceneHelper.controls.update(deltaTime);
  sceneHelper.composer.render(deltaTime);
}

function main(revolutionsCountUpdater) {
  yearCountUpdater = revolutionsCountUpdater;
  setup();

  return Object.assign(
    sceneHelper,
    { startAnimation: animate, raycaster },
  );
}

export default main;
