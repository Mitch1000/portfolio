import * as THREE from 'three';

import SceneHelper from './sceneHelper';
import { reversePainterSortStable } from '@pmndrs/uikit'

// N⋅m^2⋅kg^2
// Newtons, meter, kilogram - These are the units we are using.
// For time we are using seconds.
let sceneHelper = {};
const drawDistance = 50000;

let onMouseClick = null;
const clock = new THREE.Clock();
const offsetX = window.innerWidth * -0.12;
const offsetY = window.innerHeight * -0.15;

async function setup() {
  sceneHelper = new SceneHelper(drawDistance);
  sceneHelper.initScene();
  const { uiScene, scene } = sceneHelper;
  uiScene.background = null;
  scene.background = null;


  await sceneHelper.drawSceneObjects(offsetX, offsetY);
  return sceneHelper.rendererCompose();
}

function animate() {
  requestAnimationFrame(animate);
  const { character, introText, gravitySimulation } = sceneHelper;

  const deltaTime = clock.getDelta();

  sceneHelper.setCanvasPositionOnInitialAnimate(onMouseClick);

  character.animate(deltaTime);

  introText.animate();

  gravitySimulation.animate();

  sceneHelper.renderer.setTransparentSort(reversePainterSortStable);
  sceneHelper.controls.update(deltaTime);
  sceneHelper.root.update(deltaTime);
  sceneHelper.composer.render(deltaTime);
}

function main(onMouseClickCallback) {
  onMouseClick = onMouseClickCallback;

  setup().then(() => {
    animate();
  });

  return Object.assign(
    sceneHelper,
  );
}

export default main;
