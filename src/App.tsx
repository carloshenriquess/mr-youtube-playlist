import React, { useState, useEffect } from 'react';
import './App.scss';
import YouTube, { Options } from 'react-youtube';
import { TimeoutSink, assert } from './util';

function App() {
  const initialVideo = 3;
  const [ready, setReady] = useState<boolean>(false);
  const [playerInitialized, setPlayerInitialized] = useState<boolean>(false);
  const [player, setPlayer] = useState<YT.Player>();
  const [playedVideos, setPlayedVideos] = useState<readonly number[]>([initialVideo]);
  const [previousDisabled, setPreviousDisabled] = useState<boolean>(true);
  const [currentVideo, setCurrentVideo] = useState<number>(initialVideo);
  const [timeoutSink] = useState<TimeoutSink>(() => new TimeoutSink());
  const options: Options = {
    playerVars: {
      autoplay: 1,
    },
  };

  useEffect(() => {
    if (!player) { return; }
    assert(player);
    const initializePlayer = () => {
      player.loadPlaylist({
        list: 'PLhHHziNjM2TPIOkQqPvRGMeg32YmasOVr',
        index: initialVideo,
      });
      setPlayerInitialized(true);
    };

    initializePlayer();
  }, [player]);

  useEffect(() => {
    if (!player) { return; }
    assert(player);
    player.playVideoAt(currentVideo);
  }, [currentVideo]);

  useEffect(() => {
    const currentVideoIsFirst = !!playedVideos.length && playedVideos[0] === currentVideo;
    setPreviousDisabled(!ready || !playedVideos.length || currentVideoIsFirst);
  }, [ready, playedVideos, currentVideo])

  const onReady = (event: YT.PlayerEvent) => {
    setPlayer(event.target);
  };
  const onStateChange = (event: YT.OnStateChangeEvent) => {
    assert(player);
    timeoutSink.clearAll();
    if (playerInitialized && !ready) {
      setReady(true);
    }
    if (event.data === 1) { // ? 1 -> PLAYING
      const duration = player.getDuration() as number;
      const currentTime = player.getCurrentTime() as number;
      const remainingTime = duration - currentTime;
      const newOnVideoEnd = () => {
        console.log('videoEnd');
        player?.pauseVideo();
        playNextVideo();
      };
      timeoutSink.add(newOnVideoEnd, remainingTime * 1000 - 250);
    }
  };

  const onClickPrevious = () => {
    const currentVideoIndex = playedVideos.findIndex(video => video === currentVideo);
    if (currentVideoIndex === -1) {
      throw new Error(`onClickPrevious(): current video not found in played videos array\ncurrentVideo: ${currentVideo}\nplayedVideos: ${playedVideos}`);
    }
    if (currentVideoIndex === 0) { return; }

    setCurrentVideo(playedVideos[currentVideoIndex - 1]);
  };

  const onClickNext = () => {
    playNextVideo();
  };

  const playNextVideo = () => {
    assert(player);
    const videosLength = player.getPlaylist().length;
    if (playedVideos.length === videosLength) {
      const nextVideo = Math.floor(Math.random() * videosLength);
      setPlayedVideos([nextVideo]);
      setCurrentVideo(nextVideo);
    } else {
      const currentVideoIndex = playedVideos.findIndex(video => video === currentVideo);
      if (currentVideoIndex === -1) {
        throw new Error(`playNextVideo(): [currentVideo] não encontrado em [playedVideos]\ncurrentVideo = ${currentVideo}\nplayedVideos = ${playedVideos}`);
      }
      if (currentVideoIndex < playedVideos.length - 1) {
        setCurrentVideo(playedVideos[currentVideoIndex + 1]);
      } else {
        const getNextIndex = (): number => {
          const getNotPlayedIndex = (index: number): number => {
            if (playedVideos.includes(index)) {
              index++;
              return getNotPlayedIndex(index === videosLength ? 0 : index);
            }
            return index;
          }
          return getNotPlayedIndex(Math.floor(Math.random() * videosLength));
        }
        const nextVideo = getNextIndex();
        setPlayedVideos([...playedVideos, nextVideo]);
        setCurrentVideo(nextVideo);
      }
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
