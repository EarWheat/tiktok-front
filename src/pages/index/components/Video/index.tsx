import React from 'react';
import videojs from 'video.js';

import 'video.js/dist/video-js.css';

import './index.less';

interface VideoPlayerProps {
  src: string;
}

export default class VideoPlayer extends React.Component<VideoPlayerProps> {
  state = {
    play: true,
  };
  videoNode: HTMLVideoElement;
  player: any;
  componentDidMount() {
    // instantiate Video.js
    this.player = videojs(this.videoNode, { ...this.props }, () => {});
  }

  // destroy player on unmount
  componentWillUnmount() {
    if (this.player) {
      this.player.dispose();
    }
  }

  playVideo = () => {
    this.setState({ play: true }, () => {
      this.player.play();
    });
  };

  pauseVideo = () => {
    this.setState({ play: false }, () => {
      this.player.pause();
    });
  };

  togglePlay = () => {
    this.setState(
      {
        play: !this.state.play,
      },
      () => {
        if (this.state.play) {
          this.player.play();
        } else {
          this.player.pause();
        }
      },
    );
  };

  render() {
    const { src } = this.props;
    return (
      <div
        onClick={this.togglePlay}
        onTouchStart={this.togglePlay}
        className="hello"
      >
        <div data-vjs-player>
          <video
            ref={node => (this.videoNode = node)}
            className="video-js my-video"
            preload="auto"
            data-setup="{}"
            loop
            webkit-playsInline
            playsInline
          >
            <source src={src} type="video/mp4" />
          </video>
        </div>
      </div>
    );
  }
}
