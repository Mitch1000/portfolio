<!--
Gravity Simulation (App)
-->
<template>
  <div
    class="gravity-simulation"
  >
    <div class="sliders">
      <div class="sliders-holder">
        <div class="slider-container">
          <div class="slider-info">
            &#916;t
          </div>
          <div
            id="time-slider"
            class="slider--handle"
          >
            <div class="slider--handle-scaler">
              <div
                class="slider--handle-box"
              />
            </div>
          </div>
          <div class="slider" />
        </div>
      </div>
    </div>

    <div class="info-box-container">
      <div
        v-show="isInfoBoxOpen"
        id="info-box"
        ref="infoBox"
        class="info-box"
      >
        <!-- @click="handleInfoBoxClicked" -->
        <div
          id="name"
          ref="name"
        >
          Name:
          <span class="value" />
          <input class="info-input">
        </div>
        <div
          id="mass"
          ref="mass"
        >
          Mass:
          <span class="value" />
          <input class="info-input">
        </div>
        <div class="mass-slider-container">
          <div class="mass-slider--bar">
            <div
              id="mass-slider"
              class="mass-slider--handle"
            >
              <div
                class="mass-slider--handle-scaler"
              >
                <div
                  class="mass-slider--handle-box"
                />
              </div>
            </div>
          </div>
        </div>
        <div
          id="density"
          ref="density"
        >
          Density:
          <span class="value" />
          <input class="info-input info-input--scale">
        </div>
        <div
          id="scale"
          ref="scale"
        >
          Visual Scale:
          <span class="value" />
          <input class="info-input info-input--scale">
        </div>
        <div
          id="position"
          ref="position"
        >
          Position:
          <div>
            <span class="value" />
            <input class="info-input info-input-x info-input--scale">
            <input class="info-input info-input-y info-input--scale">
          </div>
        </div>
        <div
          id="velocity"
          ref="velocity"
        >
          Velocity:
          <div>
            <span class="value" />
            <input class="info-input info-input-x info-input--scale">
            <input class="info-input info-input-y info-input--scale">
          </div>
        </div>
        <div
          id="acceleration"
          ref="acceleration"
          style="cursor: initial;"
        >
          Acceleration:
          <div>
            <span
              class="value"
              style="cursor: initial;"
            />
            <input class="info-input info-input-x info-input--scale">
            <input class="info-input info-input-y info-input--scale">
          </div>
        </div>
      </div>
    </div>
    <div
      id="year-count"
      class="year-count"
    >
      Year: <span class="value"> 2024 </span>
    </div>
    <div
      id="scale-checkbox"
      class="scale-checkbox"
    >
      Scaled:
      <div
        class="checkbox-wrapper-3"
      >
        <input
          id="cbx-3"
          type="checkbox"
          checked
        >
        <label
          for="cbx-3"
          class="toggle"
        >
          <span />
        </label>
      </div>
    </div>
    <div class="scenario-select-container">
      <select
        id="scenario-select"
        class="scenario-select"
      />
    </div>
  </div>
</template>

<script>
import { Vector3, Raycaster } from 'three';
import mitchWorld from './helpers/index';
import handleSlider from './helpers/handleSlider';
import {Vector} from 'p5';

export default {
  name: 'GravitySimulation',

  data() {
    return {
      currentlyOpenBody: {},
      isInfoBoxClicked: false,
      massInput: false,
      scaleInput: {},
      nameInput: {},
      densityInput: {},
      positionXInput: {},
      positionYInput: {},
      velocityXInput: {},
      velocityYInput: {},
      isInfoBoxOpen: false,
      clickedTimeScale: 10,
      timeScale: 10,
      simulation: {},
      massHandler: {},
      raycaster: {},
    };
  },

  mounted() {
    this.simulation = mitchWorld(this.onCanvasClick);
    this.raycaster = new Raycaster();
  },

  destroyed() {
    // this.simulation.threeJS.remove();
  },

  methods: {
    handleInfoBoxClicked(parentEvent) {
      this.isInfoBoxClicked = true;
      this.handlePlanetInfoInputClicks(parentEvent);
      this.updatePlanetWithInfoBoxData();
    },

    getDistance(...args) {
      return Math.hypot(args[2] - args[0], args[3] - args[1]);
    },

    getMousePosition(event, camera) {
      const mouse = new Vector3();
      event.preventDefault();
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      return mouse;
    },

    manageRaycasterIntersections(mouse, scene, camera) {
      // camera.updateMatrixWorld();
      this.raycaster.setFromCamera(mouse, camera);
      const intersects = this.raycaster.intersectObjects(scene.children);
      console.log('scene.children', scene.children);
      console.log('mouse', mouse);
      console.log('intersects', intersects);

      if (intersects.length > 0) {
        console.log('interseting');
      } else {
        console.log('not interseting');
      }
    },

    onCanvasClick(parentEvent) {
      console.log(this.simulation);
      this.isInfoBoxClicked = false;
      this.updatePlanetWithInfoBoxData();
      console.log('parentEvent', parentEvent);

      const d = this.simulation.getDenormalizer();
      const zoom = this.simulation.getZoom();
      const { scene } = this.simulation;
      console.log('d.windowScale.x', d.windowScale.x);

      const { camera } = this.simulation;
      const mousePosition = this.getMousePosition(parentEvent, camera);
      this.manageRaycasterIntersections(mousePosition, scene, camera);
      console.log('mousePosition', mousePosition);
      console.log('zoom', zoom);

      const [clickedBody] = this.simulation.getPhysicsBodies().filter((body) => {
        const distance = this.getDistance(
          d.dnx(body.position.x),
          d.dny(body.position.y),
          mousePosition.x,
          mousePosition.y,
        );

        if (body.name === 'Sun') {
          console.log('body', body);
          console.log('body.offsetX', body.offset.x);
          console.log(body.position.x);
          console.log('d.dnx(body.position.x)', d.dnx(body.position.x));
          console.log('d.dnx(body.position.x)', d.dnx(body.position.x) - body.offset.x);
          console.log('d.dnx(body.position.x)', d.dnx(body.position.x) + body.offset.x);
          console.log('distance', distance);
        }
        // threeJS.mouseX - ((d.windowScale.x / 2) * shiftValue.x),
        // threeJS.mouseY - ((d.windowScale.y / 2) * shiftValue.y),
        const clickMargins = 2;

        if (distance < (body.getSize(d.windowScale.x, zoom) + clickMargins)) {
          return true;
        }
        return false;
      }).sort((a, b) => a.mass - b.mass);

      this.massHandler = {};

      if (typeof clickedBody === 'object' && !this.isInfoBoxOpen) {
        return this.openPlanetInfoBox(clickedBody, parentEvent);
      }

      if (this.isInfoBoxOpen && !this.isInfoBoxClicked) {
        return this.closePlanetInfoBox();
      }
      return null;
    },

    handlePlanetInfoInputClicks(parentEvent) {
      const massInfoEl = this.$refs.mass;
      const scaleInfoEl = this.$refs.scale;
      const nameInfoEl = this.$refs.name;
      const densityInfoEl = this.$refs.density;
      const positionInfoEl = this.$refs.position;
      const velocityInfoEl = this.$refs.velocity;

      if (parentEvent.target.id === 'name' || parentEvent.target.parentElement.id === 'name') {
        nameInfoEl
          .getElementsByTagName('span')[0].style.display = 'none';
        [this.nameInput] = nameInfoEl
          .getElementsByTagName('input');
        this.nameInput.style.display = 'initial';

        this.nameInput.placeholder = this.currentlyOpenBody.name;
        this.nameInput.focus();
      } else {
        nameInfoEl
          .getElementsByTagName('span')[0].value = '';
        nameInfoEl
          .getElementsByTagName('span')[0].style.display = 'initial';
        nameInfoEl
          .getElementsByTagName('input')[0].style.display = 'none';
      }

      if (parentEvent.target.id === 'mass' || parentEvent.target.parentElement.id === 'mass') {
        massInfoEl
          .getElementsByTagName('span')[0].style.display = 'none';
        [this.massInput] = massInfoEl
          .getElementsByTagName('input');
        this.massInput.style.display = 'initial';

        this.massInput.placeholder = Number(this.currentlyOpenBody.mass.toPrecision(5));
        this.massInput.focus();
      } else {
        massInfoEl
          .getElementsByTagName('span')[0].value = '';
        massInfoEl
          .getElementsByTagName('span')[0].style.display = 'initial';
        massInfoEl
          .getElementsByTagName('input')[0].style.display = 'none';
      }

      if (parentEvent.target.id === 'scale' || parentEvent.target.parentElement.id === 'scale') {
        scaleInfoEl
          .getElementsByTagName('span')[0].style.display = 'none';
        [this.scaleInput] = scaleInfoEl
          .getElementsByTagName('input');
        this.scaleInput.style.display = 'initial';

        this.scaleInput.placeholder = Number(this.currentlyOpenBody.scale.toPrecision(5));
        this.scaleInput.focus();
      } else {
        scaleInfoEl
          .getElementsByTagName('span')[0].value = '';
        scaleInfoEl
          .getElementsByTagName('span')[0].style.display = 'initial';
        scaleInfoEl
          .getElementsByTagName('input')[0].style.display = 'none';
      }

      if (parentEvent.target.id === 'density' || parentEvent.target.parentElement.id === 'density') {
        densityInfoEl
          .getElementsByTagName('span')[0].style.display = 'none';
        [this.densityInput] = densityInfoEl
          .getElementsByTagName('input');
        this.densityInput.style.display = 'initial';

        this.densityInput.placeholder = Number(this.currentlyOpenBody.density.toPrecision(5));
        this.densityInput.focus();
      } else {
        densityInfoEl
          .getElementsByTagName('span')[0].value = '';
        densityInfoEl
          .getElementsByTagName('span')[0].style.display = 'initial';
        densityInfoEl
          .getElementsByTagName('input')[0].style.display = 'none';
      }

      if (
        parentEvent.target.id === 'position'
        || parentEvent.target.parentElement.parentElement.id === 'position'
        || parentEvent.target.parentElement.id === 'position'
      ) {
        positionInfoEl
          .getElementsByTagName('span')[0].style.display = 'none';
        [this.positionXInput, this.positionYInput] = positionInfoEl
          .getElementsByTagName('input');

        this.positionXInput.style.display = 'initial';
        this.positionYInput.style.display = 'initial';

        this.positionXInput.placeholder = Number(
          this.currentlyOpenBody.position.x.toPrecision(4) / 10 ** 9,
        );
        this.positionYInput.placeholder = Number(
          this.currentlyOpenBody.position.y.toPrecision(4) / 10 ** 9,
        );
      } else {
        positionInfoEl
          .getElementsByTagName('span')[0].value = '';
        positionInfoEl
          .getElementsByTagName('span')[0].style.display = 'initial';
        positionInfoEl
          .getElementsByTagName('input')[0].style.display = 'none';
        positionInfoEl
          .getElementsByTagName('input')[1].style.display = 'none';
      }

      if (
        parentEvent.target.id === 'velocity'
        || parentEvent.target.parentElement.parentElement.id === 'velocity'
        || parentEvent.target.parentElement.id === 'velocity'
      ) {
        velocityInfoEl
          .getElementsByTagName('span')[0].style.display = 'none';
        [this.velocityXInput, this.velocityYInput] = velocityInfoEl
          .getElementsByTagName('input');

        this.velocityXInput.style.display = 'initial';
        this.velocityYInput.style.display = 'initial';

        this.velocityXInput.placeholder = Number(
          this.currentlyOpenBody.velocity.x.toPrecision(5) / 1000,
        );
        this.velocityYInput.placeholder = Number(
          this.currentlyOpenBody.velocity.y.toPrecision(5) / 1000,
        );
      } else {
        velocityInfoEl
          .getElementsByTagName('span')[0].value = '';
        velocityInfoEl
          .getElementsByTagName('span')[0].style.display = 'initial';
        velocityInfoEl
          .getElementsByTagName('input')[0].style.display = 'none';
        velocityInfoEl
          .getElementsByTagName('input')[1].style.display = 'none';
      }
    },

    updatePlanetWithInfoBoxData() {
      const massInfoEl = this.$refs.mass;
      const scaleInfoEl = this.$refs.scale;
      const nameInfoEl = this.$refs.name;
      const densityInfoEl = this.$refs.density;
      const positionInfoEl = this.$refs.position;
      const velocityInfoEl = this.$refs.velocity;

      if ((this.massInput.value || {}).length > 0) {
        const exponentSeparator = 'e+';
        const massString = String(this.currentlyOpenBody.mass);
        let exp = 1;

        if (massString.includes(exponentSeparator)) {
          const expString = massString.split(exponentSeparator)[1];

          exp = parseInt(expString, 10);
        } else {
          exp = massString.length;
        }

        this.currentlyOpenBody.mass = parseInt(this.massInput.value, 10) * 10 ** exp;
        massInfoEl
          .getElementsByClassName('value')[0].innerHTML = `${Number(this.currentlyOpenBody.mass.toPrecision(5))} kg`;
        this.massInput.value = '';
      }

      if ((this.scaleInput.value || {}).length > 0) {
        this.currentlyOpenBody.scale = parseFloat(this.scaleInput.value, 10);
        scaleInfoEl
          .getElementsByClassName('value')[0].innerHTML = `${Number(this.currentlyOpenBody.scale)}`;
        this.scaleInput.value = '';
      }

      if ((this.nameInput.value || {}).length > 0) {
        this.currentlyOpenBody.name = this.nameInput.value;
        nameInfoEl
          .getElementsByClassName('value')[0].innerHTML = `${Number(this.currentlyOpenBody.name)}`;
        this.nameInput.value = '';
      }

      if ((this.densityInput.value || {}).length > 0) {
        this.currentlyOpenBody.density = parseFloat(this.densityInput.value, 10);
        densityInfoEl
          .getElementsByClassName('value')[0].innerHTML = `${Number(this.currentlyOpenBody.density)}`;
        this.densityInput.value = '';
      }

      if ((this.positionXInput.value || {}).length > 0) {
        this.currentlyOpenBody.position.x = parseFloat(this.positionXInput.value, 10) * 10 ** 9;
        positionInfoEl
          .getElementsByClassName('value')[0].innerHTML = `
            x: ${Number(this.currentlyOpenBody.position.x.toPrecision(5) / 10 ** 9)} million km<br>
            y: ${Number(this.currentlyOpenBody.position.y.toPrecision(5) / 10 ** 9)} million km`;
        this.positionXInput.value = '';
      }
      if ((this.positionYInput.value || {}).length > 0) {
        this.currentlyOpenBody.position.y = parseFloat(this.positionYInput.value, 10) * 1000;
        positionInfoEl
          .getElementsByClassName('value')[0].innerHTML = `
            x: ${Number(this.currentlyOpenBody.position.x.toPrecision(5) / 10 ** 9)} million km<br>
            y: ${Number(this.currentlyOpenBody.position.y.toPrecision(5) / 10 ** 9)} million kn`;
        this.positionYInput.value = '';
      }

      if ((this.velocityXInput.value || {}).length > 0) {
        this.currentlyOpenBody.velocity.x = parseFloat(this.velocityXInput.value, 10) * 1000;
        velocityInfoEl
          .getElementsByClassName('value')[0].innerHTML = `
           &nbsp; &nbsp; x: ${Number(this.currentlyOpenBody.velocity.x.toPrecision(5) / 1000)} km/s<br>
           &nbsp; &nbsp; y: ${Number(this.currentlyOpenBody.velocity.y.toPrecision(5) / 1000)} km/s`;
        this.velocityXInput.value = '';
      }

      if ((this.velocityYInput.value || {}).length > 0) {
        this.currentlyOpenBody.velocity.y = parseFloat(this.velocityYInput.value, 10) * 1000;
        velocityInfoEl
          .getElementsByClassName('value')[0].innerHTML = `
            &nbsp; &nbsp; x: ${Number(this.currentlyOpenBody.velocity.x.toPrecision(5) / 1000)} km/s<br>
            &nbsp; &nbsp; y: ${Number(this.currentlyOpenBody.velocity.y.toPrecision(5) / 1000)} km/s`;
        this.velocityYInput.value = '';
      }
    },

    closePlanetInfoBox() {
      const infoEl = this.$refs.infoBox;
      this.currentlyOpenBody = {};
      infoEl.style.display = 'none';
      this.timeScale = this.clickedTimeScale;
      this.isInfoBoxOpen = false;
      this.isInfoBoxClicked = false;

      this.massHandler.currentPosition = 0;
      infoEl.getElementsByClassName('mass-slider--handle')[0].style.transform = 'translateX(0px)';
      return infoEl;
    },

    openPlanetInfoBox(clickedBody, parentEvent) {
      this.isInfoBoxOpen = true;

      const massInfoEl = this.$refs.mass;
      const scaleInfoEl = this.$refs.scale;
      // const { threeJS } = this.simulation;
      const infoEl = this.$refs.infoBox;
      this.currentlyOpenBody = clickedBody;
      this.clickedTimeScale = this.timeScale;

      this.handlePlanetInfoInputClicks(parentEvent);
      this.updatePlanetWithInfoBoxData();
      const shiftValue = this.simulation.getShiftValue();
      const els = Array.from(infoEl.getElementsByTagName('div'));
      // const initialBoxY = threeJS.mouseY - ((shiftValue.y - 1) * window.innerHeight);
      // const initialBoxX = threeJS.mouseX;

      infoEl.style.background = `rgb(${this.currentlyOpenBody.color[0]}, ${this.currentlyOpenBody.color[1]}, ${this.currentlyOpenBody.color[2]})`;

      infoEl.parentElement.style.top = `${initialBoxY}px`;
      infoEl.parentElement.style.left = `${initialBoxX}px`;
      this.$nextTick(() => {
        const box = infoEl.getBoundingClientRect();

        if (box.right > window.innerWidth) {
          infoEl.parentElement.style.left = `${initialBoxX - box.width}px`;
        }

        if (box.left <= 0) {
          infoEl.parentElement.style.left = `${initialBoxX + box.width}px`;
        }

        if (box.bottom > window.innerHeight) {
          infoEl.parentElement.style.top = `${initialBoxY - box.height}px`;
        }

        if (box.top <= 0) {
          infoEl.parentElement.style.top = `${initialBoxY + box.height}px`;
        }
      });

      Object.keys(this.currentlyOpenBody).forEach((key) => {
        const keyEl = els.find((el) => el.id === key);
        if (typeof keyEl !== 'object') { return; }
        let valueString = this.currentlyOpenBody[key].toString();
        if (key === 'velocity') {
          valueString = valueString.replaceAll('units', 'km/s');
        }

        if (key === 'mass') {
          valueString += 'kg';
        }

        if (key === 'position') {
          valueString = valueString.replaceAll('units', 'million km');
          valueString = `
          &nbsp; &nbsp x: ${Number(this.currentlyOpenBody[key].x.toPrecision(4) / 10 ** 9)} million km<br>
          &nbsp; &nbsp y: ${Number(this.currentlyOpenBody[key].y.toPrecision(4) / 10 ** 9)} million km`;
        }

        if (key === 'acceleration') {
          const x = Number(this.currentlyOpenBody[key].x.toPrecision(5));
          const y = Number(this.currentlyOpenBody[key].y.toPrecision(5));
          valueString = `&nbsp; &nbsp; x: ${x} m&sup2; <br> &nbsp; &nbsp;y: ${y} m&sup2;`;
        }

        if (key === 'density') {
          valueString += ' kg/m&sup3;';
        }
        if (key === 'mass') {
          valueString = `${Number(this.currentlyOpenBody[key].toPrecision(5))} kg`;
        }

        keyEl.getElementsByClassName('value')[0].innerHTML = valueString;
      });

      const massSliderEl = infoEl.getElementsByClassName('mass-slider--handle')[0];

      const updateMass = (sliderValue) => {
        const massString = String(this.currentlyOpenBody.mass);
        let exp = 1;
        const exponentSeparator = 'e+';
        if (massString.includes(exponentSeparator)) {
          const expString = massString.split(exponentSeparator)[1];

          exp = parseInt(expString, 10);
        } else {
          exp = massString.length;
        }

        const newMass = this.currentlyOpenBody.mass - sliderValue * (10 ** (exp - 1));

        if (newMass < 0) {
          this.currentlyOpenBody.mass = Math
            .max(this.currentlyOpenBody.mass - sliderValue * (10 ** (exp - 2)), 0);
        } else {
          this.currentlyOpenBody.mass = Math.min(
            newMass,
            10 * 10 ** 33,
          );
        }

        massInfoEl
          .getElementsByClassName('value')[0].innerHTML = `${Number(this.currentlyOpenBody.mass.toPrecision(5))} kg`;

        scaleInfoEl
          .getElementsByClassName('value')[0].innerHTML = Math.round(this.currentlyOpenBody.scale * 100) / 100;
      };

      this.massHandler = handleSlider(updateMass, massSliderEl, true);
      this.timeScale = 0;
      this.isInfoBoxClicked = false;
      return infoEl;
    },
  },

};
</script>

<style lang="scss" scoped>
  .app {
    position: absolute;
    z-index: 2000;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .info-box * span {
    text-transform: initial;
    cursor: pointer;
  }

  .scenario-select-container {
    position: fixed;
    top: 2vh;
    left: 0;
    width: 100vw;
    height: auto;
    z-index: 2001;
    pointer-events: none;
    overflow-y: hidden;
    display: flex;
  }
  .info-box-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 2002;
    pointer-events: none;
    overflow-y: hidden;
  }

  .info-box {
    position: absolute;
    top: 0;
    left: 0;
    width: 240px;
    height: 380px;
    background: #d7874c;
    opacity: 0.9;
    color: #131313;
    border: 2px solid black;
    border-radius: 10px;
    font-family: Roboto;
    font-size: 18px;
    padding: 12px;
    text-transform: uppercase;
    line-height: 26px;
    font-weight: 500;
    pointer-events: initial;
  }

  .scenario-select {
    width: auto;
    height: auto;
    background: black;
    border: none;
    color: #dfdfdf;
    pointer-events: initial;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 16px;
    margin-right: 4vw;
    margin-left: auto;
  }

  @media (width <= 1200px) {
    .scenario-select {
      font-size: 40px;
    }
  }


  .slider--handle {
    position: absolute;
    top: 70%;
    right: 0;
    width: 100%;
    height: auto;
    cursor: pointer;
    z-index: 1;
  }
  .slider--handle-zoom {
    top: 50%;
  }

  .slider--handle-scaler {
    transform: scaleY(1.4);
    width: 20px;
    height: 20px;
    margin: auto;
  }

  @media (width <= 1200px) {
    .slider--handle-scaler {
      width: 3vw;
      height: 3vw;
    }
  }

  @media (width <= 1000px) {
    .slider--handle-scaler {
      width: 4vw;
      height: 4vw;
      padding: 0 20px;
    }
  }

  .mass-slider--handle-scaler {
    transform: scaleX(12.4);
    width: 100%;
    height: 100%;
  }

  .mass-slider--handle {
    position: absolute;
    top: -5px;
    left: 45%;
    width: 13px;
    height: 13px;
    cursor: pointer;
  }

  .mass-slider--handle-box {
    width: 100%;
    height: 100%;
    background: rgb(8, 4, 4);
    transform: rotate(45deg);
  }

  .slider--handle-box {
    width: 100%;
    height: 100%;
    background: #dcdcc8;
    transform: rotate(45deg);
  }
  .slider-container {
    margin-left: 2%;
    margin-top: 2%;
    margin-right: 40px;
    margin-top: 2%;
    position: relative;
    margin-bottom: 40px;
    width: 4vw;
  }

  @media (width <= 1200px) {
    .slider-container {
      width: 12vw;
    }
  }

  .sliders-holder {
    margin-top: 24px;
    pointer-events: all;
  }

  .sliders {
     width: 100%;
     display: flex;
     justify-content: flex-end;
     position: absolute;
     top: 45%;
  }

  .slider {
    position: relative;
    width: 2px;
    height: 32vh;
    background: #d4d4d5;
    border-radius: 2px;
    margin-left: auto;
    margin-right: auto;
  }

  .slider-info {
    color: #f3f3e9;
    font-size: 20px;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 5px;
    text-align: center;
  }

  @media (width <= 1200px) {
    .slider-info {
      font-size: 35px;
    }
  }

  .material-symbols-outlined {
    font-variation-settings:
    'FILL' 0,
    'wght' 400,
    'GRAD' 0,
    'opsz' 24
  }
  .mass-slider-container {
    height: 30px;
    width: 100%;
    margin: 2px;
    display: flex;
    height: 25px;
    width: 100%;
    margin-left: 2px;
    display: flex;
    margin-right: 2px;
    margin-bottom: 2px;
    opacity: 0.9;
  }

  .mass-slider--bar {
    height: 4px;
    border-radius: 2px;
    background: rgb(8, 4, 4);
    width: 100%;
    margin-top: auto;
    margin-bottom: auto;
    position: relative;
  }
  .info-input {
    background: none;
    display: none;
    border: none;
    font-size: 18px;
    font-weight: 500;
    width: 72%;
  }
  .info-input--scale {
    width: 42%;
  }

  .year-count {
    position: absolute;
    bottom: 20px;
    left: 20px;
    color: wheat;
    font-size: 20px;
    font-family: Roboto;
    text-transform: uppercase;
  }

  @media (width <= 1200px) {
    .year-count {
      font-size: 30px;
    }
  }

  .year-count > span {
    font-weight: 600;
  }
  .scale-checkbox {
    position: absolute;
    top: 20px;
    left: 20px;
    color: white;
    font-size: 16px;
    font-family: Roboto;
    align-items: center;
    text-transform: uppercase;
    display: flex;
    pointer-events: all;
    opacity: 0;
  }

  .scale-checkbox > .checkbox-wrapper-3 {
    margin-left: 10px;
    opacity: 0.9;
  }

  .checkbox-wrapper-3 input[type="checkbox"] {
    visibility: hidden;
    display: none;
  }

  .checkbox-wrapper-3 .toggle {
    position: relative;
    display: block;
    width: 40px;
    height: 20px;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    transform: translate3d(0, 0, 0);
  }
  .checkbox-wrapper-3 .toggle:before {
    content: "";
    position: relative;
    top: 3px;
    left: 3px;
    width: 34px;
    height: 14px;
    display: block;
    background: #6c6c6c;
    border-radius: 8px;
    transition: background 0.2s ease;
  }
  .checkbox-wrapper-3 .toggle span {
    position: absolute;
    top: 0;
    left: 0;
    width: 20px;
    height: 20px;
    display: block;
    background: white;
    border-radius: 10px;
    box-shadow: 0 3px 8px rgba(154, 153, 153, 0.5);
    transition: all 0.2s ease;
  }
  .checkbox-wrapper-3 .toggle span:before {
    content: "";
    position: absolute;
    display: block;
    margin: -18px;
    width: 56px;
    height: 56px;

    background: #6c6c6c;
    border-radius: 50%;
    transform: scale(0);
    opacity: 1;
    pointer-events: none;
  }

  .checkbox-wrapper-3 #cbx-3:checked + .toggle:before {
    background: white;
  }
  .checkbox-wrapper-3 #cbx-3:checked + .toggle span {
    background: rgb(206, 45, 79);
    transform: translateX(20px);
    transition: all 0.2s cubic-bezier(0.8, 0.4, 0.3, 1.25), background 0.15s ease;
    box-shadow: 0 3px 8px rgba(79, 46, 220, 0.2);
  }
  .checkbox-wrapper-3 #cbx-3:checked + .toggle span:before {
    transform: scale(1);
    opacity: 0;
    transition: all 0.4s ease;
  }
  .gravity-simulation {
    overflow: hidden;
    position: absolute;
    width: 100vw;
    height: 100vh;
    max-width: 100vw;
    max-height: 100vh;
    top: 0;
    left: 0;
    z-index: 1;
    pointer-events: none;
  }
</style>
