import React from 'react';
import kaori from './assets/kaori.gif';
import './App.scss';

function App() {
  return (
    <div className="l-container">
      <h1 className="c-title">Best anime</h1>
      <p className="c-subtitle">Shigatsu wa Kimi no Uso</p>
      <img src={kaori} alt="Kaori" />
    </div>
  );
}

export default App;
