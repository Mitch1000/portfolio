import * as THREE from 'three';

import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { ClearPass } from 'three/examples/jsm/postprocessing/ClearPass';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass';

import CameraControls from 'camera-controls';
import { CrtShader } from './tvShader';
import Character from './character';
import GravitySimulation from './gravitySimulation';
import IntroText from './introText';
import handleSlider from './handleSlider';

// N⋅m^2⋅kg^2
// Newtons, meter, kilogram - These are the units we are using.
// For time we are using seconds.
let canvas = {};
let controls = {};
let renderer = {};
let camera = {};
let composer = {};
let planetsRender = {};
let mainRender = {};
let shaderPass = {};
const drawDistance = 50000;

let onMouseClick = null;
const clock = new THREE.Clock();
const offsetX = window.innerWidth * -0.12;
const offsetY = window.innerHeight * -0.15;

let scene = {};
let scene2 = {};
let character = {};
let gravitySimulation = {};
let introText = {};
let introText2 = {};

CameraControls.install({ THREE });

function initLight(currentScene) {
  const dirLight = new THREE.PointLight('#ffffff', 1.8, 1000, 0.01);
  const dirLight2 = new THREE.PointLight('#ffffff', 1.8, 1000, 0.01);
  const dirLight3 = new THREE.PointLight('#ffffff', 1.8, 1000, 0.01);
  const dirLight4 = new THREE.PointLight('#ffffff', 1.8, 1000, 0.01);

  dirLight.position.set(offsetX, 0, 0);
  dirLight2.position.set(offsetX, 0, 0);
  dirLight3.position.set(offsetX, 0, 0);

  dirLight4.position.set(0, 214, 0);

  dirLight3.rotation.set(180, 0, 0);
  dirLight2.rotation.set(180, 0, 0);

  const ambientLight = new THREE.AmbientLight('#ffffff', 1);

  currentScene.add(dirLight, dirLight2, dirLight3, dirLight4, ambientLight);
}

function initRenderer() {
  const glRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

  glRenderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(glRenderer.domElement);
  return glRenderer;
}

function initCamera() {
  const cam = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    50,
    drawDistance,
  );

  const isMobile = window.innerWidth < 1200;

  cam.position.x = -0.02;
  cam.position.y = 0;
  cam.position.z = isMobile ? -1200 : -800;
  return cam;
}

function initControl(cam) {
  const ctrl = new CameraControls(cam, renderer.domElement);
  ctrl.rotate(0, -6 * THREE.MathUtils.DEG2RAD, true);
  return ctrl;
}

function handleTimeSlider(timeSliderCallback) {
  const timeSliderEl = document.getElementById('time-slider');
  return handleSlider(timeSliderCallback, timeSliderEl);
}

function handleScenarioSelect(initialScenario, scenarioKeys, scenarioSelectCallback) {
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
}

function setup() {
  renderer = initRenderer();
  renderer.autoClear = false;
  camera = initCamera();
  controls = initControl(camera, renderer);
  canvas = renderer.domElement;
  scene = new THREE.Scene();
  scene.background = null;

  scene2 = new THREE.Scene();
  scene2.background = null;

  const loadedCallback = (model) => {
    scene.add(model);
    scene2.add(model);
  };

  const initialScenario = 'Solar System';
  gravitySimulation = new GravitySimulation({
    offset: new THREE.Vector3(offsetX, offsetY, 0),
    scene,
    scene2,
    currentScenario: initialScenario,
  });

  character = new Character({
    scene,
    renderer,
    camera,
    controls,
    offset: new THREE.Vector3(0, offsetY, 0),
    loadedCallback,
  });

  introText = new IntroText({
    scene,
    scene2,
    ySpeed: 0.04,
    glitch: true,
    kerning: 12.5,
    offsetTime: 200,
    glitchColor: { x: 0.9, y: 0, z: 0.1 },
    amplitude: 8,
    initialPositionX: 215,
    scale: 0.125,
  });

  introText.draw();

  introText2 = new IntroText({
    scene,
    scene2,
    textString: 'A Developer Portfolio',
    initialPositionY: 70,
    initialPositionX: 135,
    size: 400,
    scale: 0.055,
    kerning: 3.2,
    color: '#c9c8ab',
    ySpeed: 0.04,
    glitch: true,
    glitchColor: { x: 1, y: 0.1670, z: 0.0429 },
  });

  introText2.draw();

  initLight(scene);
  initLight(scene2);

  const timeSliderCallback = (sliderValue) => {
    character.updateAnimation(sliderValue);
    gravitySimulation.updateTimeConstant(sliderValue);
  };

  const timeSlider = handleTimeSlider(timeSliderCallback);

  const scenarioSelectCallback = (event) => {
    timeSlider.reset();
    gravitySimulation.updateCurrentScenario(event);
  };

  handleScenarioSelect(
    initialScenario,
    GravitySimulation.getScenariosList(),
    scenarioSelectCallback,
  );

  const clearPass = new ClearPass();

  mainRender = new RenderPass(scene2, camera);
  mainRender.clear = false;

  planetsRender = new RenderPass(scene, camera);
  planetsRender.clear = false;

  const screenSize = new THREE.Vector2(window.innerWidth, window.innerHeight);
  const bloomPass = new UnrealBloomPass(screenSize, 1.5, 0.4, 0.85);
  bloomPass.threshold = 0.0;
  bloomPass.strength = 0.2;
  bloomPass.radius = 0.0;

  const smaaPass = new SMAAPass();

  const outputPass = new OutputPass();
  outputPass.renderToScreen = true;

  shaderPass = new ShaderPass(CrtShader);

  composer = new EffectComposer(renderer);
  composer.setSize(window.innerWidth, window.innerHeight);

  composer.addPass(clearPass);
  composer.addPass(mainRender);
  composer.addPass(bloomPass);
  composer.addPass(planetsRender);
  composer.addPass(smaaPass);
  composer.addPass(shaderPass);
  composer.addPass(outputPass);

  composer.render();
}

function animate() {
  requestAnimationFrame(animate);

  const deltaTime = clock.getDelta();

  if (canvas.style.position !== 'absolute') {
    canvas.addEventListener('click', onMouseClick);

    canvas.style.position = 'absolute';
    canvas.style.top = 0;
    canvas.style.left = '0';
    canvas.style.maxWidth = '100vw';
    canvas.style.maxHeight = '100vh';
    canvas.style.overflow = 'hidden';
  }

  character.animate(deltaTime);

  introText.animate();
  introText2.animate();

  gravitySimulation.animate();

  controls.update(deltaTime);
  mainRender.clear = true;
  composer.render(deltaTime);
}

function main(onMouseClickCallback) {
  onMouseClick = onMouseClickCallback;

  setup();
  animate();
}

export default main;
