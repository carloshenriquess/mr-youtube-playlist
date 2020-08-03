import React, { useState, useEffect } from 'react';
import './App.scss';
import YouTube, { Options } from 'react-youtube';

function App() {
  const initialVideo = 3;
  const [ready, setReady] = useState<boolean>(false);
  const [playerInitialized, setPlayerInitialized] = useState<boolean>(false);
  const [player, setPlayer] = useState<YT.Player>();
  const [playedVideos, setPlayedVideos] = useState<readonly number[]>([initialVideo]);
  const [previousDisabled, setPreviousDisabled] = useState<boolean>(true);
  const [currentVideo, setCurrentVideo] = useState<number>(initialVideo);
  const options: Options = {
    playerVars: {
      autoplay: 1,
    },
  };

  useEffect(() => {
    window.addEventListener('blur', () => {
      if (player?.getPlayerState() === 2) { // ? Paused
        player?.playVideo();
      }
    });
  }, [])

  useEffect(() => {
    if (!player) { return; }
    initializePlayer();
  }, [player]);

  useEffect(() => {
    if (!player) { return; }
    player?.playVideoAt(currentVideo);
  }, [currentVideo]);

  useEffect(() => {
    const currentVideoIsFirst = !!playedVideos.length && playedVideos[0] === currentVideo;
    setPreviousDisabled(!ready || !playedVideos.length || currentVideoIsFirst);
  }, [ready, playedVideos, currentVideo])

  const onReady = (event: YT.PlayerEvent) => {
    setPlayer(event.target);
  };
  const endVideoListener = () => {
    player?.pauseVideo();
    playNextVideo();
  };
  const onStateChange = (event: YT.OnStateChangeEvent) => {
    if (playerInitialized && !ready) {
      setReady(true);
    }
    if (event.data === 1) {
      const duration = player?.getDuration() as number;
      const currentTime = player?.getCurrentTime() as number;
      const remainingTime = duration - currentTime;
      clearTimeout(endVideoListener as any);
      setTimeout(endVideoListener, remainingTime * 1000);
    }
  };

  const onClickNext = () => {
    playNextVideo();
  };

  const onClickPrevious = () => {
    const currentVideoIndex = playedVideos.findIndex(video => video === currentVideo);
    if (currentVideoIndex > 0) {
      setCurrentVideo(playedVideos[currentVideoIndex - 1]);
    }
  };

  const initializePlayer = () => {
    player?.loadPlaylist({
      list: 'PLhHHziNjM2TPIOkQqPvRGMeg32YmasOVr',
      index: 3,
    });
    setPlayerInitialized(true);
  };

  const playNextVideo = () => {
    const videosLength = player?.getPlaylist().length || 0;
    if (playedVideos.length === videosLength) {
      setPlayedVideos([]);
    }
    const currentVideoIndex = playedVideos.findIndex(video => video === currentVideo);
    if (currentVideoIndex >= 0 && currentVideoIndex !== playedVideos.length - 1) {
      setCurrentVideo(playedVideos[currentVideoIndex + 1]);
    } else {
      const getNextIndex = (nextVideo: number): number => {
        if (playedVideos.includes(nextVideo)) {
          nextVideo++;
          return getNextIndex(nextVideo === videosLength ? 0 : nextVideo);
        }
        return nextVideo;
      }
      const nextVideo = getNextIndex(Math.floor(Math.random() * videosLength));
      setPlayedVideos([...playedVideos, nextVideo]);
      setCurrentVideo(nextVideo);
    }
  }

  return (
    <div className="l-app">
      <div className="c-player">
        <div className="c-player__iframe-wrapper">
          <YouTube className="c-player__iframe" opts={options} onReady={onReady} onStateChange={onStateChange} />
        </div>
        <div className="c-player__buttons">
          <button className="c-player__btn" onClick={onClickPrevious} disabled={previousDisabled} type="button">PREVIOUS</button>
          <button className="c-player__btn" onClick={onClickNext} disabled={!ready} type="button">NEXT</button>
        </div>
      </div>
    </div>
  );
}

export default App;
