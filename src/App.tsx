import React, { useState, useEffect, SyntheticEvent } from 'react';
import './App.scss';
import { Options } from 'react-youtube';
import { TimeoutSink, assert } from './util';
import { Player } from './Player';
import { Clipboard } from 'react-feather';

function App() {
  const [initialVideo, setInitialVideo] = useState<number>(3);
  const [ready, setReady] = useState<boolean>(false);
  const [playerInitialized, setPlayerInitialized] = useState<boolean>(false);
  const [player, setPlayer] = useState<YT.Player>();
  const [playlistId, setPlaylistId] = useState<string>('PLhHHziNjM2TPIOkQqPvRGMeg32YmasOVr');
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
    player.loadPlaylist({
      list: playlistId,
      index: initialVideo,
    });
    setPlayerInitialized(true);
  }, [player, playlistId, initialVideo]);

  // mudança
  useEffect(() => {
    if (!player) { return; }
    assert(player);
    player.playVideoAt(currentVideo);
  }, [currentVideo, player]);

  useEffect(() => {
    const currentVideoIsFirst = !!playedVideos.length && playedVideos[0] === currentVideo;
    setPreviousDisabled(!ready || !playedVideos.length || currentVideoIsFirst);
  }, [ready, playedVideos, currentVideo])

  const onReady = (event: YT.PlayerEvent) => {
    setPlayer(event.target);
  };
  const onStateChange = (event: YT.OnStateChangeEvent) => {
    assert(player);
    timeoutSink.clear();
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
      timeoutSink.sink = setTimeout(newOnVideoEnd, remainingTime * 1000 - 250);
    }
  };
  const onChangeInput = (event: SyntheticEvent) => {
    const { value } = event.target as any;
    setInitialVideo(0);
    setPlaylistId(value);
  }

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
      <div className="c-input">
        <input className="c-input__input" type="text" onInput={onChangeInput} />
        <button className="c-input__button" type="button">
          <Clipboard className="c-input__button-icon" />
        </button>
      </div>
      <Player options={options} onStateChange={onStateChange} onReady={onReady} onClickNext={onClickNext} onClickPrevious={onClickPrevious} previousDisabled={previousDisabled} nextDisabled={!ready} />
    </div>
  );
}

export default App;
