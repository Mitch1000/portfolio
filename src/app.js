// const React = window.React
// import ReactDOM from 'react-dom/client';
const React = window.React;
const ReactDOM = window.ReactDOM;

import GravitySimulation from './components/GravitySimulation.jsx';

const container = document.getElementById('app');

const root = ReactDOM.createRoot(container);
root.render(<GravitySimulation />)

export default root;
