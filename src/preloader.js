import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';

const THREE = import('three');

THREE.then((value) => {
  window.THREE = value;

  window.setup();
});

const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();

const fontLoader = new FontLoader();

dracoLoader.setDecoderPath('/');
loader.setDRACOLoader(dracoLoader);

const set = (key, value, object) => {
  object[key] = value; 
  object.onSetListeners.forEach((listener) => {
    listener(value);
  });
}

const character = {
  set(key, value) {
    set(key, value, this);
  },
  onSetListeners: [],
};

const ignoreFont = {
  set(key, value) {
    set(key, value, this);
  },
  onSetListeners: [],
};

window.character = character;
window.ignoreFont = ignoreFont;

loader.load('/assets/Character.glb', (glb) => {
  window.character.set('glb', glb);
});

fontLoader.load('assets/Ignore.json', (font) => {
  window.ignoreFont.set('font', font);
});
