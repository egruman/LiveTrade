import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

// var socket = io.connect('http://localhost:3001');

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
