import React from 'react';
import videojs from 'video.js';

import 'video.js/dist/video-js.css';

import './index.less';

export default class VideoPlayer extends React.Component {
  state = {
    play: true,
    didMount: false,
  };
  videoNode: HTMLVideoElement;
  player: any;
  componentDidMount() {
    // instantiate Video.js
    this.player = videojs(this.videoNode, { ...this.props }, () => {
      this.setState({ didMount: true }, () => {
        const res = this.player.play();
        if (res) {
          res.finally(() => {});
        }
      });
    });

    document.addEventListener('WeixinJSBridgeReady', this.playVideo, false);

    //@ts-ignore
    window.wx.config({
      // 配置信息, 即使不正确也能使用 wx.ready
      debug: false,
      appId: 'gh_1a8c118653f8',
      timestamp: 1,
      nonceStr: '',
      signature: '',
      jsApiList: [],
    });
    //@ts-ignore
    window.wx.ready(function() {
      this.player.play();
    });
  }

  // destroy player on unmount
  componentWillUnmount() {
    if (this.player) {
      this.player.dispose();
    }

    document.removeEventListener('WeixinJSBridgeReady', this.playVideo, false);
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
            autoPlay
            loop
            webkit-playsInline
            playsInline
          >
            <source
              src="https://mp4.vjshi.com/2020-02-12/b80f178923f85a4e4d3a24b1beaf048d.mp4"
              type="video/mp4"
            />
          </video>
        </div>
      </div>
    );
  }
}
