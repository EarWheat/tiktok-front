import React, { useCallback } from 'react';
import ReactFullpage from '@fullpage/react-fullpage';
import { RecoilRoot } from 'recoil';

import Video from './components/Video';
import { Comment, CommentIcon } from './components/Comment';

const Fullpage = () => {
  const ref = React.useRef([]);

  const afterLoad = useCallback(
    (origin, destination) => {
      const destinationVideoPlayer = ref.current[destination.index];
      const originVideoPlayer = ref.current[origin.index];
      if (destinationVideoPlayer && destinationVideoPlayer.player) {
        document.addEventListener(
          'WeixinJSBridgeReady',
          () => {
            ref.current.forEach((video, index) => {
              video.player.play();
              if (index !== destination.index) {
                video.player.pause();
              }
            });
          },
          false,
        );

        destinationVideoPlayer.player.play();
      }

      if (
        origin.index !== destination.index &&
        originVideoPlayer &&
        originVideoPlayer.player
      ) {
        originVideoPlayer.player.pause();
      }
    },
    [ref.current],
  );

  const data = [
    {
      id: '1',
      src:
        'https://mp4.vjshi.com/2020-02-12/b80f178923f85a4e4d3a24b1beaf048d.mp4',
    },
    {
      id: '2',
      src:
        'https://mp4.vjshi.com/2019-11-21/0735dcbcb5fa2e5ee5e4fb7639f2a06d.mp4',
    },
    {
      id: '3',
      src:
        'https://mp4.vjshi.com/2019-01-07/b49262c14070bfff694139590812f798.mp4',
    },
  ];
  return (
    <RecoilRoot>
      {/** @ts-ignore */}
      <ReactFullpage
        //fullpage options
        licenseKey={'YOUR_KEY_HERE'}
        continuousVertical
        scrollingSpeed={500} /* Options here */
        afterLoad={afterLoad}
        render={() => {
          return (
            <div>
              {data.map((item, index) => {
                return (
                  <div className="section" key={index}>
                    <Video
                      src={item.src}
                      ref={v => {
                        if (ref.current.length < data.length) {
                          ref.current.push(v);
                        }
                      }}
                    />
                    <CommentIcon commentId={item.id} />
                  </div>
                );
              })}
            </div>
          );
        }}
      />
      <Comment />
    </RecoilRoot>
  );
};

export default Fullpage;
