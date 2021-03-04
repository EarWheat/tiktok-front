import React, { useState, useEffect, useCallback } from 'react';
import { AtFloatLayout, AtIcon, AtAvatar, AtInput, AtButton } from 'taro-ui';
import { atom, useRecoilState } from 'recoil';
import { get, sortBy } from 'lodash';

import { fetchComments, postComment } from '../../../../services';
import { Comment as IComment } from '../../../../interface';
import { user } from '../../../../user';

import 'taro-ui/dist/style/components/float-layout.scss';
import 'taro-ui/dist/style/components/avatar.scss';
import 'taro-ui/dist/style/components/icon.scss';
import 'taro-ui/dist/style/components/input.scss';
import 'taro-ui/dist/style/components/button.scss';
import 'taro-ui/dist/style/components/loading.scss';

import './index.less';

const commentAtom = atom<{
  isOpened: boolean;
  mediaId: string;
  data: IComment[];
}>({
  key: 'commentAtom',
  default: {
    isOpened: false,
    mediaId: '',
    data: [],
  },
});

const useData = (mediaId: string, isOpened: boolean) => {
  const [data, setData] = useState<IComment[]>([]);
  useEffect(() => {
    if (isOpened) {
      const init = async () => {
        try {
          const res = await fetchComments(mediaId);
          setData(get(res, 'data.data') || []);
        } catch (error) {
          console.log(error);
        }
      };

      init();
    }
  }, [isOpened]);

  return data;
};

export const Comment: React.FC = () => {
  const [{ isOpened, mediaId, data }, setComment] = useRecoilState(commentAtom);

  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);

  const onClose = () => {
    setComment({ isOpened: false, mediaId: '', data: [] });
  };

  const onInputChange = nextValue => {
    setValue(nextValue);
  };

  const onSubmit = useCallback(async () => {
    if (value) {
      setLoading(true);
      try {
        await postComment({
          mediaId,
          content: value,
          ...user,
        });
        const res = await fetchComments(mediaId);
        setComment(pre => ({
          ...pre,
          data: get(res, 'data.data') || [],
        }));

        setValue('');
      } catch (error) {}

      setLoading(false);
    }
  }, [mediaId, value]);

  const nextData = sortBy(
    (Array.isArray(data) ? data : []).map((item, index) => ({
      ...item,
      index: data.length - index,
    })),
    ['index'],
  );

  return (
    <AtFloatLayout
      isOpened={isOpened}
      title="评论"
      scrollTop={800}
      onClose={onClose}
    >
      <div className="comment-main">
        {nextData.map((item, index) => (
          <div key={index} className="comment">
            <AtAvatar
              circle
              image={item.avatar}
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
      </div>
      <div className="comment-input">
        <AtInput
          name="comment"
          type="text"
          placeholder="请输入评论"
          value={value}
          onChange={onInputChange}
        >
          <AtButton
            size="small"
            type="primary"
            loading={loading}
            onClick={onSubmit}
          >
            发表
          </AtButton>
        </AtInput>
      </div>
    </AtFloatLayout>
  );
};

export const CommentIcon: React.FC<{ commentId: string }> = props => {
  const { commentId } = props;
  const [{ isOpened, mediaId }, setComment] = useRecoilState(commentAtom);

  const data = useData(commentId, isOpened);

  const onOpen = useCallback(() => {
    setComment({
      isOpened: true,
      data,
      mediaId: commentId,
    });
  }, [data]);

  useEffect(() => {
    if (commentId === mediaId) {
      setComment(pre => ({ ...pre, data }));
    }
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
