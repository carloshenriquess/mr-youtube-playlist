import React, { FunctionComponent } from 'react';
import YouTube, { Options } from 'react-youtube';
import './styles.scss';

interface PlayerProps {
  previousDisabled?: boolean;
  nextDisabled?: boolean;
  options?: Options;
  onReady?(event: { target: YT.Player }): void;
  onStateChange?(event: { target: YT.Player, data: number }): void;
  onClickPrevious?(): void;
  onClickNext?(): void;
}

export const Player: FunctionComponent<PlayerProps> = props => {
  return (
    <div className="c-player">
      <div className="c-player__iframe-wrapper">
        <YouTube className="c-player__iframe" opts={props.options} onReady={props.onReady} onStateChange={props.onStateChange} />
      </div>
      <div className="c-player__buttons">
        <button className="c-player__btn" onClick={props.onClickPrevious} disabled={props.previousDisabled} type="button">PREVIOUS</button>
        <button className="c-player__btn" onClick={props.onClickNext} disabled={!props.nextDisabled} type="button">NEXT</button>
      </div>
    </div>
  );
}