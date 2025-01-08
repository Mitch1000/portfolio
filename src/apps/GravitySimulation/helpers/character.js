import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { solidify, getToonMaterial } from './toonLighting';

class Character {
  constructor({
    scene,
    renderer,
    camera,
    controls,
  }) {
    this.scene = scene;
    this.renderer = renderer;
    this.camera = camera;
    this.controls = controls;
    this.model = null;
    this.mixer = null;
    this.action = null;
    this.animationFrameCount = 0;
    this.animationLoopFrame = 448;

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
        const clip = THREE.AnimationClip.findByName(clips, 'Walk');
        this.action = this.mixer.clipAction(clip);
        this.action.setLoop(THREE.LoopOnce);
        if (typeof this.action.play === 'function') {
          this.action.play();
        }
        console.log('this.model', this.model);
        const scale = 60;
        this.model.scale.set(scale, scale, scale);
        this.model.rotation.set(0, (210 * (Math.PI / 180)), 0);
        this.model.position.set(window.innerWidth * 0.2, 0, -50);
        const char = this.model.children[1].geometry;
        console.log('char', char);

        const charMaterial = await getToonMaterial('crimson');

        const character = new THREE.Mesh(char, charMaterial);

        character.rotation.set(0, (180 * (Math.PI / 180)), 0);
        character.scale.setScalar(150);
        this.scene.add(this.model);

        // solidify(character, this.scene);
        this.scene.remove(this.scene.getObjectByName(''));
        const names = [];
        this.scene.traverse((obj) => names.push(obj.name));
      },
      (xhr) => {
        console.log(`${Math.max((xhr.loaded / xhr.total) * 100, 100)} loaded.`);
      },
      (error) => {
        console.error('An error happened:', error);
      },
    );
  }

  animate(deltaTime) {
    if (this.mixer instanceof THREE.AnimationMixer) {
      this.mixer.update(deltaTime);
      this.animationFrameCount += 1;

      if (this.animationFrameCount >= this.animationLoopFrame) {
        this.action
          .reset()
          .play();
        this.animationFrameCount = 0;
      }
    }
  }
}
export default Character;
