import React from 'react';
import avif from 'assets/img/1.png?as=avif';
import webp from 'assets/img/1.png?as=webp';
import png from 'assets/img/1.png';
import styles from './App.module.scss';

export function App() {
  return (
    <div className={styles.cls}>
      <p>webpack starter template ITSM</p>
      <picture>
        <source srcSet={avif} type="image/avif" />
        <source srcSet={webp} type="image/webp" />
        <img src={png} alt="MDN" />
      </picture>
    </div>
  );
}
