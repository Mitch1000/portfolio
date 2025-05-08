import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { ShaderPass }from 'three/examples/jsm/postprocessing/ShaderPass';
import * as THREE from 'three';
import CameraControls from 'camera-controls';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { ClearPass } from 'three/examples/jsm/postprocessing/ClearPass';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass';
import { CrtShader } from './tvShader';
import Character from './character';
import IntroTextRenderer from './introTextRenderer';
import GravitySimulation from './gravitySimulation';
import { handleTimeSlider, handleScenarioSelect } from './uiHelpers';
import { SVGRenderer } from 'three/addons/renderers/SVGRenderer.js';

CameraControls.install({ THREE });
// TODO: Stop relying so much on helper pattern
export default class SceneHelper {
  constructor(drawDistance) {
    this.initScene();
    this.initRenderer();
    this.initCamera(drawDistance);
    this.initControls();
  }

  rendererCompose(uiScene, uiCamera) {
    const clearPass = new ClearPass();
    this.uiScene = uiScene;
    this.uiCamera = uiCamera;

    this.planetsRender = new RenderPass(this.scene, this.camera);
    this.planetsRender.clear = false;
    this.planetsRender.clearDepth = true;

    this.mainRender = new RenderPass(uiScene, uiCamera);
    this.mainRender.clear = false;
    this.mainRender.clearDepth = true;

    const screenSize = new THREE.Vector2(window.innerWidth, window.innerHeight);
    const bloomPass = new UnrealBloomPass(screenSize, 1.5, 0.4, 0.85);
    bloomPass.threshold = 0.0;
    bloomPass.strength = 0.2;
    bloomPass.radius = 0.0;

    const smaaPass = new SMAAPass();

    const outputPass = new OutputPass();
    outputPass.renderToScreen = true;

    const shaderPass = new ShaderPass(CrtShader);

    this.composer = new EffectComposer(this.renderer);
    this.composer.setSize(window.innerWidth, window.innerHeight);


    this.composer.addPass(clearPass);
    this.composer.addPass(this.planetsRender);
    this.composer.addPass(this.mainRender);
    this.composer.addPass(bloomPass);
    this.composer.addPass(smaaPass);
    this.composer.addPass(shaderPass);
    this.composer.addPass(outputPass);

    this.composer.render();
  }

  getCanvas() {
    return this.renderer.domElement;
  }

  initLight(offsetX) {
    const dirLight = new THREE.PointLight('#ffffff', 1.8, 1000, 0.01);
    const dirLight2 = new THREE.PointLight('#ffffff', 1.8, 1000, 0.01);
    const dirLight3 = new THREE.PointLight('#ffffff', 1.8, 1000, 0.01);
    const dirLight4 = new THREE.PointLight('#ffffff', 1.8, 1000, 0.01);
    dirLight.name = 'Light 1';
    dirLight2.name = 'Light 2';
    dirLight3.name = 'Light 3';
    dirLight4.name = 'Light 4';

    dirLight.position.set(offsetX, 0, 0);
    dirLight2.position.set(offsetX, 0, 0);
    dirLight3.position.set(offsetX, 0, 0);

    dirLight4.position.set(0, 214, 0);

    dirLight3.rotation.set(180, 0, 0);
    dirLight2.rotation.set(180, 0, 0);

    const ambientLight = new THREE.AmbientLight('#ffffff', 1);

    this.scene.add(dirLight, dirLight2, dirLight3, dirLight4, ambientLight);
  }

  initRenderer() {
    const canvas = document.getElementById('root');

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    // this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.autoClear = false;

    this.renderer.localClippingEnabled = true

    return this.renderer;
  }

  initCamera(drawDistance) {
    this.camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      50,
      drawDistance,
    );

    const isMobile = window.innerWidth < 1200;

    this.camera.position.x = -0.02;
    this.camera.position.y = 0;
    this.camera.position.z = isMobile ? -1200 : -800;
  }

  initControls() {
    this.controls = new CameraControls(this.camera, this.renderer.domElement);
    this.controls.rotate(0, -6 * THREE.MathUtils.DEG2RAD, true);
    return this.controls;
  }

  initScene() {
    this.scene = new THREE.Scene();
  }

  setCanvasPositionOnInitialAnimate() {
    const canvas = this.getCanvas();
    if (canvas.style.position === 'absolute') { return; }

    canvas.style.position = 'absolute';
    canvas.style.top = 0;
    canvas.style.left = '0';
    canvas.style.maxWidth = '100vw';
    canvas.style.maxHeight = '100vh';
    canvas.style.overflow = 'hidden';
  }

  async draw(offsetX, offsetY) {
    const initialScenario = 'Solar System';

    this.gravitySimulation = new GravitySimulation({
      offset: new THREE.Vector3(offsetX, offsetY, 0),
      scene: this.scene,
      currentScenario: initialScenario,
    });

    await this.gravitySimulation.drawPhysicsBodies();

    this.introText = new IntroTextRenderer(this.scene);
    await this.introText.draw();

    this.character = new Character({
      scene: this.scene,
      renderer: this.renderer,
      camera: this.camera,
      controls: this.controls,
      offset: new THREE.Vector3(0, offsetY, 0),
    });

    await this.character.initModel();

    this.scene.add(this.character.model);
    this.initLight(offsetX);

    const timeSliderCallback = (sliderValue) => {
      this.character.updateAnimation(sliderValue);
      this.gravitySimulation.updateTimeConstant(sliderValue);
    };

    const timeSlider = handleTimeSlider(timeSliderCallback);

    const scenarioSelectCallback = (event) => {
      timeSlider.reset();
      this.gravitySimulation.updateCurrentScenario(event);
    };

    handleScenarioSelect(
      initialScenario,
      GravitySimulation.getScenariosList(),
      scenarioSelectCallback,
    );
  }
}
