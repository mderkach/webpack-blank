import React from 'react';
import { render } from 'react-dom';
import reportWebVitals from './reportWebVitals';
import './index.scss';

render(<p>hello</p>, document.getElementById('root'));
reportWebVitals(process.env.NODE_ENV !== 'production' ? console.log : undefined);
