import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { solidify, getToonMaterial } from './toonLighting';

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
    this.animationFrameCount = 0;
    // this.animationLoopFrame = 448; // Walk frames
    this.animationLoopFrame = 1035; // Idle frames
    // this.animationLoopFrame = 53; // Running frames
    this.offsetX = offset.x;
    this.offsetY = offset.y;
    this.offsetZ = offset.z;
    this.loadedCallback = loadedCallback;

    this.initModel();
  }

  initModel() {
    const loader = new GLTFLoader();
    loader.load(
      '/Character.glb',
      async (glb) => {
        this.model = glb.scene;
        this.mixer = new THREE.AnimationMixer(this.model);
        const clips = glb.animations;
        console.log('glb.animations', glb.animations);

        const clip = THREE.AnimationClip.findByName(clips, 'Idle.001');
        this.action = this.mixer.clipAction(clip);

        this.model.scale.setScalar(70);
        this.model.rotation.set(0, (210 * (Math.PI / 180)), 0);
        this.model.position.set(
          window.innerWidth * 0.15 + this.offsetX,
          0 + this.offsetY,
          -30 + this.offsetZ,
        );
        this.loadedCallback(this.model);
      },
      (xhr) => {
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
      if (this.animationFrameCount <= 0) {
        this.action.reset();
        this.action.play();
        this.animationFrameCount = 0;
      }

      this.animationFrameCount += 1;

      if (this.animationFrameCount >= this.animationLoopFrame) {
        this.animationFrameCount = 0;
      }
    }
  }
}
export default Character;
