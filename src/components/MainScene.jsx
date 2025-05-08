import React from 'react';
import { useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { WebGLRenderer } from 'three';
import { animate } from '../helpers/index';


let hasRendered = false;
let startedRendering = false;
// const { onCanvasClick } = uiHelpers;
// TODO: Remove this as it only here to get the uiScene object.
async function startSimulation(uiScene, uiCamera, simulation, renderer) {
  const offsetX = window.innerWidth * -0.12;
  const offsetY = window.innerHeight * -0.15;

  await simulation.draw(offsetX, offsetY); 

  const canvas = document.getElementById('root');
  const rend = new WebGLRenderer({ canvas, antialias: true, alpha: true });

  rend.setSize(window.innerWidth, window.innerHeight);
  // this.renderer.setPixelRatio( window.devicePixelRatio );
  rend.autoClear = false;

  rend.localClippingEnabled = true

  renderer.clearDepth = rend.clearDepth;
  
  simulation.rendererCompose(uiScene, uiCamera, rend);
  simulation.startAnimation();
}



export default function MainScene({ simulation }) {
  const { scene, camera, gl } = useThree();
  scene.background = null;

  useEffect(() => {
    if (!startedRendering) {
      startedRendering = true;
      startSimulation(scene, camera, simulation, gl).then(() => {
        hasRendered = true;
      })
    }
  });

  return (<></>);
}
