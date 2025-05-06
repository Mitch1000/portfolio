import { useEffect, useState } from 'react';
import { Raycaster } from 'three';
import React from 'react';
import uiHelpers from '../helpers/uiHelpers';
import gravitySim from '../helpers/index';

export default function GravitySimulation() {
  const [isScaled, setIsScaled] = useState(0);
  const { onCanvasClick } = uiHelpers;
  let isInfoBoxOpen = false;
  let isInfoBoxClicked = false;

  useEffect(() => { 
    const handleClick = (event) => {

      // uiHelpers.onCanvasClick(event, isInfoBoxOpen, isInfoBoxClicked) 
    };

    const simulation = gravitySim(handleClick);
    // const { scene, renderer, camera } = simulation;

    console.log('use effect', simulation);


    const raycaster = new Raycaster();
  }, []);

  function handleCheck(e) {
    console.log('handleCheck', e, isScaled);
    setIsScaled(!isScaled);
  }

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
        id="year-count"
        className="year-count"
      >
        Year: <span className="value"> 2024 </span>
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
      <canvas id="root"></canvas>
    </div>
  )
}

