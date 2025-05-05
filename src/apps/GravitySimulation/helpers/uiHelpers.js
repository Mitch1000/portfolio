import handleSlider from './handleSlider';

export default {
  handleTimeSlider(timeSliderCallback) {
    const timeSliderEl = document.getElementById('time-slider');
    return handleSlider(timeSliderCallback, timeSliderEl);
  },

  handleScenarioSelect(initialScenario, scenarioKeys, scenarioSelectCallback) {
    const scenarioSelectEl = document.getElementById('scenario-select');
    scenarioSelectEl.value = initialScenario;
    scenarioSelectEl.addEventListener('click', (event) => event.preventDefault());
    scenarioSelectEl.addEventListener('change', scenarioSelectCallback);

    scenarioKeys.forEach((scenarioKey) => {
      const opt = document.createElement('option');
      opt.value = scenarioKey;
      opt.innerHTML = scenarioKey;
      scenarioSelectEl.appendChild(opt);
    });
  },
};
