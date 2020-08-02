import React, { useEffect, useState } from 'react';
import './App.scss';

import Player from './Player';

function App() {
  const [output, setOutput] = useState<string[]>([]);
  const play = () => {
    const message = 'PLAY:' + new Date().toTimeString();
    setOutput([...output, message]);
  }

  useEffect(() => {
    window.addEventListener("blur", () => {
      setTimeout(() => play(), 2000);
    });
  }, []);

  const onClickPlay = () => {
    play();
  }

  return (
    <div className="l-app">
      <Player />
      <button className="c-app__btn" onClick={onClickPlay} type="button">PLAY</button>
      <ul>
        {output.map((message, i) => <li key={i}>{message}</li>)}
      </ul>
    </div>
  );
}

export default App;
