import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

class Character {
  constructor() {
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.control = null;
    this.model = null;
    this.mixer = null;
    this.clock = new THREE.Clock();
    this.action = null;
    this.animationFrameCount = 0;
    this.animationLoopFrame = 448;

    this.initScene();
    this.initCamera();
    this.initRenderer();
    this.initLight();
    this.initControl();
    this.initModel();
    console.log('constructor');
  }

  initScene() {
    this.scene = new THREE.Scene();
    console.log('this.scene', this.scene);

    this.scene.background = null;
  }

  initCamera() {
    this.camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.01,
      1000,
    );
    this.camera.position.x = 0.02;
    this.camera.position.y = 5;
    this.camera.position.z = 10;
  }

  initRenderer() {
    const canvas = document.getElementById('defaultCanvas0');
    console.log('canvas', canvas);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, canvas });

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);
  }

  initLight() {
    const light = new THREE.AmbientLight(0xffffff, 1);
    const light2 = new THREE.PointLight(0xffffff, 1);
    light2.position.set(70, 70, 50);
    light.position.set(50, 90, 50);
    this.scene.add(light);
  }

  initControl() {
    this.control = new OrbitControls(this.camera, this.renderer.domElement);
    this.control.enableDamping = true;
    this.control.dampingFactor = 0.05;
    this.control.autoRotate = true;
    this.control.autoRotateSpeed = 2.0;
  }

  initModel() {
    const loader = new GLTFLoader();
    loader.load(
      '/Character.glb',
      (glb) => {
        console.log(glb);
        this.model = glb.scene;
        this.mixer = new THREE.AnimationMixer(this.model);
        const clips = glb.animations;
        console.log('clips', clips);
        const clip = THREE.AnimationClip.findByName(clips, 'Walk');
        console.log('animation', clip);
        this.action = this.mixer.clipAction(clip);
        this.action.setLoop(THREE.LoopOnce);
        if (typeof this.action.play === 'function') {
          this.action.play();
        }

        this.scene.add(this.model);
        this.scene.remove(this.scene.getObjectByName(''));
        const names = [];
        this.scene.traverse((obj) => names.push(obj.name));
        console.log('names', names);

        console.log('this.scene', this.scene);
      },
      (xhr) => {
        console.log(`${Math.max((xhr.loaded / xhr.total) * 100, 100)} loaded.`);
      },
      (error) => {
        console.error('An error happened:', error);
      },
    );
  }

  animate() {
    console.log(this.renderer);
    console.log(this.scene);
    console.log(this.camera);
    if (this.mixer instanceof THREE.AnimationMixer) {
      const deltaTime = this.clock.getDelta();
      this.mixer.update(deltaTime);
      this.animationFrameCount += 1;

      if (this.animationFrameCount >= this.animationLoopFrame) {
        console.log('loop', this.animationFrameCount);
        this.action
          .reset()
          .play();
        this.animationFrameCount = 0;
      }
    }
    this.renderer.render(this.scene, this.camera);
  }
}
export default Character;
