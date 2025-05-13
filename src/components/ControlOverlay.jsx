import React from 'react';

export default function ControlOverlay() {
  const handleCheck = () => {
    // setIsScaled(!isScaled);
  };

  return (
   <div className="control-overlay">
    <div className="sliders">
      <div className="sliders-holder">
        <div className="slider-container">
          <div className="slider-info ">
            <span className="info"> &#916;t</span>
          </div>
          <div
            id="time-slider"
            className="slider--handle"
          >
            <div className="slider--handle-scaler">
              <div
                className="slider--handle-box"
              ></div>
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
   </div>
  );
}
