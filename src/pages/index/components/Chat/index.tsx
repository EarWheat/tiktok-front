import React, { useState, useCallback, useRef, useEffect } from 'react';
import { AtAvatar, AtInput, AtButton } from 'taro-ui';
import classNames from 'classnames';
import { get } from 'lodash';

import { postChat } from '../../../../services';
import { user } from '../../../../user';

import 'taro-ui/dist/style/components/drawer.scss';
import 'taro-ui/dist/style/components/list.scss';

import './index.less';

interface ChatItemProps {
  isMyself: boolean;
  content: string;
  userName: string;
  avatar: string;
}

const robot = {
  userName: '小刘同学',
  avatar:
    'http://e0.ifengimg.com/04/2019/0201/858D15BF94432706808480AAA0B6EE29D561468E_size33_w600_h375.jpeg',
};
const ChatItem: React.FC<ChatItemProps> = props => {
  const { content, userName, isMyself, avatar } = props;
  return (
    <div
      className={classNames('chat-item', { ['chat-item-myself']: isMyself })}
    >
      <div className="chat-avatar">
        <AtAvatar circle image={avatar} size="small"></AtAvatar>
      </div>
      <div className="chat-content">
        <div className="chat-content-text">{content}</div>
      </div>
    </div>
  );
};

const Chat: React.FC = () => {
  const [data, setData] = useState([
    {
      content: '你好呀~',
      isMyself: false,
      ...robot,
    },
  ]);

  const [value, setValue] = useState('');

  const onInputChange = nextValue => {
    setValue(nextValue);
  };

  const onSubmit = useCallback(async () => {
    setData(pre => [
      ...pre,
      {
        content: value,
        isMyself: true,
        ...user,
      },
    ]);

    setValue('');

    const token = localStorage.getItem('token');

    const res = await postChat({
      token,
      request: {
        query: value,
        user_id: user.userId
      },
    });

    const nextChatItem = {
      content: get(res, 'data.data'),
      isMyself: false,
      ...robot,
    };

    setData(pre => [...pre, nextChatItem]);
  }, [value]);

  const node = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (node.current) {
      node.current.scrollTop = node.current.scrollHeight;
    }
  }, [data]);

  return (
    <div className="chat">
      <div className="chat-title">小刘同学</div>
      <div className="chat-main" ref={node}>
        {data.map((item, index) => {
          return <ChatItem key={index} {...item} />;
        })}
      </div>
      <div className="chat-input">
        <AtInput
          name="chat"
          type="text"
          placeholder="请输入"
          value={value}
          onChange={onInputChange}
        >
          <AtButton size="small" type="primary" onClick={onSubmit}>
            发送
          </AtButton>
        </AtInput>
      </div>
    </div>
  );
};

export default Chat;
