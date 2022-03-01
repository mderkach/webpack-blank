import React from 'react';
import { render } from 'react-dom';
import reportWebVitals from './reportWebVitals';
import styles from './App.module.scss';

function App() {
  return <div className={styles.cls}>webpack starter template ITSM</div>;
}

render(<App />, document.getElementById('root'));
reportWebVitals(console.log);
