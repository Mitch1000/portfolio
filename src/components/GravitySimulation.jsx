const { useState, useEffect } = window.React;
const { Canvas } = window.ReactFiber;
import { Container } from '../test/container.js';
import { Fullscreen } from '../test/fullscreen.js';
const React = window.React;
import { main } from '../helpers/index';
import { setPlanetClickHandler, setMousePosition, setCharacterClickHandler } from '../helpers/uiHelpers';
import Styles from '../stylesheets/gravity_simulation.css';
import InfoBox from './InfoBox.jsx';
import Links from './Links.jsx';
import ControlOverlay from './ControlOverlay.jsx';
import YearCount from './YearCount.jsx';
import MainScene from './MainScene.jsx';
//const MainScene = lazy(() => import('./MainScene.jsx'));
let isClicked = false;

export default function GravitySimulation() {
  const [simulation, setSimulation] = useState({});
  const [timeScale, setTimeScale] = useState(0);
  const [isInfoBoxOpen, setIsInfoBoxOpen] = useState(false);
  const [clickedPlanet, setClickedPlanet] = useState(null);
  const [parentEvent, setParentEvent] = useState(null);
  const year = new Date().getFullYear();
  const [yearCount, setYearCount] = useState(year);

  const yearCountUpdater = (value) => {
    setYearCount(value);
  };

  const isInfoBoxClicked = false;
  // For pausing the simulation when an info box is opened.
  const setSimulationTimeScale = (value, sim) => {
    sim.gravitySimulation.setTimeScale(value);
  };

  const planetClickHandler = (planet, sim) => {
    if (!isClicked) { return; }

    isClicked = false;
    setClickedPlanet(planet);

    const isPlanetClick = planet !== null && typeof planet === 'object';

    setIsInfoBoxOpen(isPlanetClick);
    if (isPlanetClick) {
      setTimeScale(sim.gravitySimulation.getTimeScale());
      return setSimulationTimeScale(0, sim);
    }
  };

  const characterClickHandler = ({ simulation }) => {
    if (!isClicked) { return; }
    isClicked = false;

    if (typeof simulation.character !== 'object') {
      return null;
    }
  
    const { cycleAnimation } = simulation.character;
  
    if (typeof cycleAnimation !== 'function') {
      return null;
    }
  
    simulation.character.cycleAnimation();
    return null;
  };



  const onSimulationClick = (event) => {
    const sim = simulation;
    isClicked = true;
    if (timeScale === null) {
      setTimeScale(sim.gravitySimulation.getTimeScale());
    }

    setMousePosition(event);
    setParentEvent(event);

    // Close the Info Box and set time scale
    if (isInfoBoxOpen && !isInfoBoxClicked) {
      setSimulationTimeScale(timeScale, sim);

      return setIsInfoBoxOpen(false);
    }
  };

  const handleMouseMove = (event) => {
    setMousePosition(event);
  };

  useEffect(() => {
    const sim = main(yearCountUpdater);
    setSimulation(sim);
    addEventListener('resize', () => {
      sim.renderer.setSize(window.innerWidth, window.innerHeight);
    });

    setPlanetClickHandler(planetClickHandler);
    setCharacterClickHandler(characterClickHandler);
  }, [setSimulation]);

  return (
    <div
      className="gravity-simulation"
    >
      <canvas id="root" onMouseMove={handleMouseMove} onMouseDown={onSimulationClick}></canvas>
      <ControlOverlay> </ControlOverlay>
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
    </div>
  )
}
