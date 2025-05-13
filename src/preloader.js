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

dracoLoader.setDecoderPath('https://character-2ea.pages.dev/');
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
window.assetsUrl = 'https://character-2ea.pages.dev/assets';

loader.load(`${window.assetsUrl}/Character.glb`, (glb) => {
  window.character.set('glb', glb);
});

fontLoader.load(`${window.assetsUrl}/Ignore.json`, (font) => {
  window.ignoreFont.set('font', font);
});
