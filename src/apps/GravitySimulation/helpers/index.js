import * as THREE from 'three';

import SceneHelper from './sceneHelper';

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
  const scene = sceneHelper.initScene();
  scene.background = null;

  await sceneHelper.drawSceneObjects(offsetX, offsetY);
  return sceneHelper.rendererCompose();
}

function animate() {
  requestAnimationFrame(animate);
  const { character, introText, gravitySimulation } = sceneHelper;

  const deltaTime = clock.getDelta();

  sceneHelper.setCanvasPositionOnInitialAnimate();

  character.animate(deltaTime);

  introText.animate();

  gravitySimulation.animate();

  sceneHelper.controls.update(deltaTime);
  sceneHelper.mainRender.clear = true;
  sceneHelper.composer.render(deltaTime);
}

function main(onMouseClickCallback) {
  onMouseClick = onMouseClickCallback;

  setup().then(() => {
    animate();
  });

  return Object.assign(
    sceneHelper,
    {
      getShiftValue: () => 1,
      getZoom: () => 1,
    },
  );
}

export default main;
