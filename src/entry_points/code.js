/*
  Mitch World

  This is the master container view for the vue Mitch World app

  This app is displayed at the following URL http://localhost:3000/communities/1/events/3700 and
  shows photo albums relevant to a specific event.
*/

import Vue from 'vue';

import App from '../apps/GravitySimulation/app.vue';

function runApp() {
  window.addEventListener('DOMContentLoaded', () => {
    new Vue({ // eslint-disable-line no-new
      el: '#gravity-simulation',

      render(createElement) {
        return createElement(App);
      },
    });
  });
}
export default runApp;
