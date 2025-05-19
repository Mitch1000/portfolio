const React = window.React;
const { useEffect } = window.React;
const { useFrame, useThree } = window.ReactFiber;
const { WebGLRenderer } = window.THREE;


let hasRendered = false;
let startedRendering = false;
// TODO: Remove this as it only here to get the uiScene object.
async function startSimulation(uiScene, uiCamera, simulation, renderer) {
  const offsetX = window.innerWidth * -0.12;
  const offsetY = window.innerHeight * -0.15;

  const canvas = document.getElementById('root');
  await simulation.draw(offsetX, offsetY); 


  const gravitySimContainer = document.getElementsByClassName('gravity-simulation')[0];
  const appContainer = document.getElementsByClassName('app')[0];
  gravitySimContainer.style.opacity = 1;
  app.style.opacity = 1;

  canvas.style.opacity = 1;

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
