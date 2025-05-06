import React from 'react'
import ReactDOM from 'react-dom/client';
import GravitySimulation from './components/GravitySimulation.jsx';

const container = document.getElementById('app');

const root = ReactDOM.createRoot(container);
root.render(<GravitySimulation />)

export default root;
