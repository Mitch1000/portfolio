import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Fullscreen } from '@react-three/uikit';
import React from 'react';
import Box from '../components/Box.jsx';
import gravitySim from '../helpers/index';
import { onCanvasClick, setMousePosition } from '../helpers/uiHelpers';
import Styles from '../stylesheets/gravity_simulation.css';
import InfoBox from './InfoBox.jsx';
import YearCount from './YearCount.jsx';


export default function GravitySimulation() {
  const [isScaled, setIsScaled] = useState(0);
  const [simulation, setSimulation] = useState({});
  const [isInfoBoxOpen, setIsInfoBoxOpen] = useState(false);
  const [clickedPlanet, setClickedPlanet] = useState(null);
  const [parentEvent, setParentEvent] = useState(null);
  const [yearCount, setYearCount] = useState(2024);

  const yearCountUpdater = (value) => {
    setYearCount(value);
  };

  const handleMouseMove = (event) => {
    setMousePosition(event);
  }

  useEffect(() => {
    const sim = gravitySim(yearCountUpdater);
    setSimulation(sim);
  }, [setSimulation])



  function handleCheck(e) {
    setIsScaled(!isScaled);
  }


  const isInfoBoxClicked = false;

  const onSimulationClick = (event) => {
    console.log('onSimulationClick');
    
    if (isInfoBoxOpen && !isInfoBoxClicked) {
      return setIsInfoBoxOpen(false);
    }

    const planet = onCanvasClick({
      parentEvent: event, 
      simulation, 
    });


    setClickedPlanet(planet);

    setParentEvent(event);
    const isPlanetClick = planet !== null && typeof planet === 'object';

    setIsInfoBoxOpen(isPlanetClick);
  };

  return (
    <div
      className="gravity-simulation"
    >
      <div className="sliders">
        <div className="sliders-holder">
          <div className="slider-container">
            <div className="slider-info">
              &#916;t
            </div>
            <div
              id="time-slider"
              className="slider--handle"
            >
              <div className="slider--handle-scaler">
                <div
                  className="slider--handle-box"
                />
              </div>
            </div>
            <div className="slider" />
          </div>
        </div>
      </div>
      <div
        id="scale-checkbox"
        className="scale-checkbox"
      >
        Scaled:
        <div
          className="checkbox-wrapper-3"
        >
          <input
            id="cbx-3"
            onChange={handleCheck}
            type="checkbox"
            checked
          />
          <label
            htmlFor="cbx-3"
            className="toggle"
          >
            <span />
          </label>
        </div>
      </div>
      <div className="scenario-select-container">
        <select
          id="scenario-select"
          className="scenario-select"
        />
      </div>
      <canvas id="root" onClick={onSimulationClick} onMouseMove={handleMouseMove}></canvas>
         
      <div id="ui-canvas-containers" className="ui-canvas-container" >
        <Canvas id="ui-root" className="ui-scene" style={{ pointerEvents: 'none' }} gl={{ localClippingEnabled: true, clearDepth: true }}>
          <Fullscreen flexDirection="row" padding={0} gap={2} >
            <Box simulation={simulation}></Box>

            <YearCount count={yearCount}></YearCount>
            {isInfoBoxOpen &&
              <InfoBox
                clickedPlanet={clickedPlanet}
                event={parentEvent}
              >
              </InfoBox>
            }
          </Fullscreen>

        </Canvas>
      </div>
    </div>
  )
}
