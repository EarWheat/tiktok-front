import React, { useState, useEffect, useCallback } from 'react';
import { AtFloatLayout, AtIcon, AtAvatar, AtInput, AtButton } from 'taro-ui';
import { atom, useRecoilState, useSetRecoilState } from 'recoil';
import { get, reverse } from 'lodash';

import { fetchComments, postComment } from '../../../../services';
import { Comment as IComment } from '../../../../interface';

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

const useData = (mediaId: string) => {
  const [data, setData] = useState<IComment[]>([]);
  useEffect(() => {
    const init = async () => {
      try {
        const res = await fetchComments(mediaId);
        setData(get(res, 'data.data') || []);
      } catch (error) {
        console.log(error);
      }
    };

    init();
  }, []);

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
          userName: '郭麒麟',
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

  return (
    <AtFloatLayout
      isOpened={isOpened}
      title="评论"
      scrollTop={800}
      onClose={onClose}
    >
      <div className="comment-main">
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
  const setComment = useSetRecoilState(commentAtom);

  const data = useData(commentId);

  const onOpen = useCallback(() => {
    setComment({
      isOpened: true,
      data,
      mediaId: commentId,
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
