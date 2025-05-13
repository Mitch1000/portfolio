import { useState, useEffect, lazy, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Fullscreen, Container } from '@react-three/uikit';
import React from 'react';
import { main } from '../helpers/index';
import { onCanvasClick, setMousePosition } from '../helpers/uiHelpers';
import Styles from '../stylesheets/gravity_simulation.css';
import InfoBox from './InfoBox.jsx';
import Links from './Links.jsx';
import ControlOverlay from './ControlOverlay.jsx';
import YearCount from './YearCount.jsx';
import Loader from './Loader.jsx';
const MainScene = lazy(() => import('./MainScene.jsx'));

let currentTimeScale = null; 
let isBoxOpen = false; 

export default function GravitySimulation() {
  const [isScaled, setIsScaled] = useState(0);
  const [simulation, setSimulation] = useState({});
  const [isInfoBoxOpen, setIsInfoBoxOpen] = useState(false);
  const [clickedPlanet, setClickedPlanet] = useState(null);
  const [parentEvent, setParentEvent] = useState(null);
  const year = new Date().getFullYear()
  const [yearCount, setYearCount] = useState(year);

  const yearCountUpdater = (value) => {
    setYearCount(value);
  };

  const isInfoBoxClicked = false;

  const onSimulationClick = (event) => {
    const sim = simulation;
    const setTimeScale = (value) => {
      sim.gravitySimulation.setTimeScale(value);
    };

    if (currentTimeScale === null) {
      currentTimeScale = sim.gravitySimulation.getTimeScale();
    }

    if (isBoxOpen && !isInfoBoxClicked) {
      setTimeScale(currentTimeScale);
      isBoxOpen = false;
      return setIsInfoBoxOpen(false);
    }

    const planet = onCanvasClick({
      parentEvent: event, 
      simulation: sim, 
    });

    setClickedPlanet(planet);

    setParentEvent(event);
    const isPlanetClick = planet !== null && typeof planet === 'object';

    setIsInfoBoxOpen(isPlanetClick);
    isBoxOpen = isPlanetClick;
    if (isPlanetClick){
      currentTimeScale = sim.gravitySimulation.getTimeScale();
      return setTimeScale(0);
    }
  };

  const handleMouseMove = (event) => {
    setMousePosition(event);
  }

  useEffect(() => {
    const sim = main(yearCountUpdater);
    setSimulation(sim);
    addEventListener('resize', () => {
      sim.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }, [setSimulation])

  return (
    <div
      className="gravity-simulation"
    >
      <canvas id="root" onMouseMove={handleMouseMove} onClick={onSimulationClick}></canvas>
      <ControlOverlay> </ControlOverlay>
      <Suspense fallback={<Loader />}>
        <div
          id="ui-canvas-container"
          className="ui-canvas-container"
        >
          <Canvas
            id="ui-root"
            className="ui-scene"
            style={{ pointerEvents: 'none' }}
            gl={{ localClippingEnabled: true, clearDepth: true }}
          >
            <Fullscreen flexDirection="row" padding={0} gap={2} >
              <MainScene simulation={simulation}></MainScene>
              <Container
                name="ui-container"
                position="absolute"
                positionTop={0} 
                positionLeft={0} 
                minWidth="100%"
                minHeight="100%"
                backgroundColor="#0096FF"
                backgroundOpacity={0.01}
              >
                <YearCount count={yearCount}></YearCount>

                {isInfoBoxOpen &&
                  <InfoBox
                    clickedPlanet={clickedPlanet}
                    event={parentEvent}
                  >
                  </InfoBox>
                }
                <Links camera={simulation.camera} mainScene={simulation.scene}></Links>
              </Container>
            </Fullscreen>
          </Canvas>
        </div>
      </Suspense>
    </div>
  )
}
