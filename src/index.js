import React from 'react';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import * as ReactDOM from 'react-dom/client';
import GravitySimulation from './components/GravitySimulation.jsx';

const container = document.getElementById('app');

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
};

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

if (typeof window.setup === 'function') {
  window.setup();
}

const root = ReactDOM.createRoot(container);
root.render(
  <GravitySimulation> </GravitySimulation>
);

export default root;

