import React, { useEffect } from 'react';
import './App.scss';

import Player from './Player';

function App() {
  const play = () => {
    console.log('PLAY:', new Date().toTimeString());
  }

  const onClickPlay = () => {
    play();
  }

  useEffect(() => {
    window.addEventListener("blur", () => {
      setTimeout(() => play(), 2000);
    });
  }, [])

  return (
    <div className="l-app">
      <Player />
      <button className="c-app__btn" onClick={onClickPlay} type="button">PLAY</button>
    </div>
  );
}

export default App;
