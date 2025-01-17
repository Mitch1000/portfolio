import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';


class Character {
  constructor({
    renderer,
    camera,
    controls,
    offset,
    loadedCallback,
  }) {
    this.renderer = renderer;
    this.camera = camera;
    this.controls = controls;
    this.model = null;
    this.mixer = null;
    this.action = null;

    this.offsetX = offset.x;
    this.offsetY = offset.y;
    this.offsetZ = offset.z;
    this.loadedCallback = loadedCallback;
    this.clips = [];

    this.initModel();
  }

  updateAnimation(sliderValue) {
    const currentActionName = this.action.getClip().name;

    if (sliderValue > 45) {
      if (currentActionName !== 'Running') {
        this.setToRunAnimation(this.clips);
      }
      return;
    }

    if (sliderValue > 2) {
      if (currentActionName !== 'Walk') {
        this.setToWalkAnimation(this.clips);
      }
      return;
    }

    if (sliderValue < 2 && currentActionName !== 'Idle.001') {
      this.setToIdleAnimation(this.clips);
    }
  }

  setAnimation(animationName, clips) {
    if (this.action) {
      this.action.stop();
      this.action.reset()
        .fadeOut(1)
        .play();
    }

    const clip = THREE.AnimationClip.findByName(clips, animationName);
    this.action = this.mixer.clipAction(clip);
    this.action.reset();
    this.action.play();
  }

  setToWalkAnimation(clips) {
    this.animationFrameCount = 0;
    this.animationLoopFrame = 448; // Running frames

    this.setAnimation('Walk', clips);
  }

  setToRunAnimation(clips) {
    this.animationFrameCount = 0;
    this.animationLoopFrame = 54; // Running frames

    this.setAnimation('Running', clips);
  }

  setToIdleAnimation(clips) {
    this.animationFrameCount = 0;
    this.animationLoopFrame = 1035; // Idle frames

    this.setAnimation('Idle.001', clips);
  }

  initModel() {
    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();

    dracoLoader.setDecoderPath('/');
    loader.setDRACOLoader(dracoLoader);

    loader.load(
      '/assets/Character.glb',
      async (glb) => {
        this.model = glb.scene;
        this.mixer = new THREE.AnimationMixer(this.model);

        this.clips = glb.animations;

        this.model.scale.setScalar(80);
        this.model.rotation.set(0, (210 * (Math.PI / 180)), 0);
        this.model.position.set(
          window.innerWidth * 0.15 + this.offsetX,
          0 + this.offsetY,
          -30 + this.offsetZ,
        );
        this.setToIdleAnimation(glb.animations);
        this.action.setLoop(THREE.LoopRepeat);
        this.action.clampWhenFinished = true;
        this.action.enable = true;
        this.action.play();

        this.loadedCallback(this.model);
      },
      () => {
        // console.log(`${Math.max((xhr.loaded / xhr.total) * 100, 100)} loaded.`);
      },
      (error) => {
        console.error('An error happened:', error);
      },
    );
  }

  animate(deltaTime) {
    if (this.mixer instanceof THREE.AnimationMixer) {
      this.mixer.update(deltaTime);

      this.animationFrameCount = 0;

      this.animationFrameCount += 1;

      if (this.animationFrameCount >= this.animationLoopFrame) {
        this.animationFrameCount = 0;
      }
    }
  }
}
export default Character;
