let hasSetup = false;

window.setup = () => {
  hasSetup = true;
  import('./entry_points/code');
}

const isObj = (value) => typeof value === 'object';
const hasLoaded = isObj(window.THREE)
  && isObj(window.React)
  && isObj(window.ReactDOM)
  && isObj(window.ReactFiber);

if (hasLoaded && !hasSetup) {
  window.setup();
}
