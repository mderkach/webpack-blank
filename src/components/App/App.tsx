import React from 'react';
import styles from './App.module.scss';

export function App() {
  return (
    <div className={styles.cls}>
      <p>webpack starter template ITSM</p>
      <picture>
        <source srcSet="./assets/img/1.avif" type="image/avif" />
        <source srcSet="./assets/img/1.webp" type="image/webp" />
        <img src="./assets/img/1.png" alt="MDN" />
      </picture>
    </div>
  );
}
