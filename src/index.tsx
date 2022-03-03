import React from 'react';
import {render} from 'react-dom';
import reportWebVitals from './reportWebVitals';
import './index.scss';
import {App} from './components';

render(<App />, document.getElementById('root'));
reportWebVitals(console.log);
