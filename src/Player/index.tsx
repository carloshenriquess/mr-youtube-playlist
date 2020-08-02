import React, { FC } from 'react'
import './styles.scss';

const Player: FC = () => {
  return (
    <div className="c-iframe">
      <iframe
        className="c-iframe__iframe"
        src="https://www.youtube.com/embed/videoseries?list=PLhHHziNjM2TPIOkQqPvRGMeg32YmasOVr"
        frameBorder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  )
}

export default Player;