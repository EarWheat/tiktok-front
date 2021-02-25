import React, { useState } from 'react';
import { AtFloatLayout, AtIcon } from 'taro-ui';
import { atom, useRecoilState, useSetRecoilState } from 'recoil';

import 'taro-ui/dist/style/components/float-layout.scss';
import 'taro-ui/dist/style/components/icon.scss';

import './index.less';

const commentAtom = atom({
  key: 'commentAtom',
  default: {
    isOpened: false,
    data: [],
  },
});

export const Comment: React.FC = () => {
  const [{ isOpened, data }, setComment] = useRecoilState(commentAtom);

  const onClose = () => {
    setComment({ isOpened: false, data: [] });
  };

  return (
    <AtFloatLayout
      isOpened={isOpened}
      title="评论"
      scrollY
      scrollTop={800}
      onClose={onClose}
    >
      {data.map(item => item.content)}
    </AtFloatLayout>
  );
};

export const CommentIcon: React.FC<{ commentId: string }> = props => {
  const { commentId } = props;
  const setComment = useSetRecoilState(commentAtom);

  const onOpen = () => {
    setComment({
      isOpened: true,
      data: [
        {
          content: `评论-${commentId}`,
        },
      ],
    });
  };

  return (
    <div className="tiktok-comment">
      <div onClick={onOpen}>
        <AtIcon
          className="tiktok-comment-icon"
          value="message"
          customStyle={{ fontSize: 40 }}
          color="#FFF"
        ></AtIcon>
        <div className="tiktok-comment-text">写评论</div>
      </div>
    </div>
  );
};
