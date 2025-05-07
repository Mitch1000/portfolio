import React from 'react';
import { useThree } from '@react-three/fiber';


// const { onCanvasClick } = uiHelpers;
async function startSimulation(uiScene, uiCamera, simulation) {
  const offsetX = window.innerWidth * -0.12;
  const offsetY = window.innerHeight * -0.15;

  await simulation.draw(offsetX, offsetY); 

  simulation.rendererCompose(uiScene, uiCamera);

  simulation.startAnimation();
}

let hasRendered = false;

export default function Box(props) {
  const { scene, camera } = useThree();

  if (!hasRendered) {
    startSimulation(scene, camera, props.simulation);
    hasRendered = true;
  }


  return (<> </>);
}
