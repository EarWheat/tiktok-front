import React, { useCallback, useState } from 'react';
import ReactFullpage from '@fullpage/react-fullpage';
import { RecoilRoot } from 'recoil';

import Video from './components/Video';
import { Comment, CommentIcon } from './components/Comment';
import { fetchMedias } from '../../services';
import { Media } from '../../interface';

const useData = () => {
  const [data] = useState<Media[]>(() => {
    const res = fetchMedias();
    return res.data;
  });
  return data;
};

const Fullpage = () => {
  const ref = React.useRef([]);
  const data = useData();

  const afterLoad = useCallback(
    (origin, destination) => {
      const destinationVideoPlayer = ref.current[destination.index];
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

      const originVideoPlayer = ref.current[origin.index];
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

  const render = useCallback(() => {
    return (
      <div>
        {data.map((item, index) => {
          return (
            <div className="section" key={index}>
              <Video
                src={item.resource}
                ref={v => {
                  if (ref.current.length < data.length) {
                    ref.current.push(v);
                  }
                }}
              />
              <CommentIcon commentId={item.mediaId} />
            </div>
          );
        })}
      </div>
    );
  }, [data]);

  if (data.length === 0) {
    return null;
  }

  return (
    <RecoilRoot>
      {/** @ts-ignore */}
      <ReactFullpage
        //fullpage options
        licenseKey={'YOUR_KEY_HERE'}
        continuousVertical
        scrollingSpeed={500} /* Options here */
        afterLoad={afterLoad}
        render={render}
      />
      <Comment />
    </RecoilRoot>
  );
};

export default Fullpage;
