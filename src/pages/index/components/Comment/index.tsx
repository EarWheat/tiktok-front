import React, { useState, useEffect, useCallback } from 'react';
import { AtFloatLayout, AtIcon, AtAvatar } from 'taro-ui';
import { atom, useRecoilState, useSetRecoilState } from 'recoil';
import { get } from 'lodash';

import { fetchComments } from '../../../../services';
import { Comment as IComment } from '../../../../interface';

import 'taro-ui/dist/style/components/float-layout.scss';
import 'taro-ui/dist/style/components/avatar.scss';
import 'taro-ui/dist/style/components/icon.scss';

import './index.less';

const commentAtom = atom<{
  isOpened: boolean;
  data: IComment[];
}>({
  key: 'commentAtom',
  default: {
    isOpened: false,
    data: [],
  },
});

const useData = (mediaId: string) => {
  const [data, setData] = useState<IComment[]>([]);
  useEffect(() => {
    const init = async () => {
      try {
        const res = await fetchComments(mediaId);
        setData(pre => [...pre, ...(get(res, 'data') || [])]);
      } catch (error) {
        console.log(error);
      }
    };

    init();
  }, []);

  return data;
};

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
      {data.map((item, index) => (
        <div key={index} className="comment">
          <AtAvatar
            circle
            text={item.userName}
            size="small"
            className="comment-avatar"
          ></AtAvatar>
          <div className="comment-main">
            <div className="comment-name">{item.userName}</div>
            <div className="comment-content">{item.content}</div>
            <div className="comment-time">{item.updateTime}</div>
          </div>
        </div>
      ))}
    </AtFloatLayout>
  );
};

export const CommentIcon: React.FC<{ commentId: string }> = props => {
  const { commentId } = props;
  const setComment = useSetRecoilState(commentAtom);

  const data = useData(commentId);

  const onOpen = useCallback(() => {
    setComment({
      isOpened: true,
      data,
    });
  }, [data]);

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
