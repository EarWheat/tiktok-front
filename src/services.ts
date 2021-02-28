import axios from 'axios';

export const fetchMedias = () => {
  //   return axios.get('http://106.54.76.130:8080/confucius/media/getMediaList');
  return JSON.parse(
    '{"errNo":0,"errMsg":"success","data":[{"userName":"张三","mediaId":"3451e401fc134abe9760613a687a0aee","resource":"https://mp4.vjshi.com/2019-12-10/5bcb45461c10a929ab0ddab665ba9ef5.mp4","createTime":"1971-01-01 00:00:00","updateTime":"1971-01-01 00:00:00"},{"userName":"张三","mediaId":"c1740663f4a24527b6225e03f0aea5bf","resource":"https://mp4.vjshi.com/2020-03-13/575bf5e035a1c0b1c820b03f99e99ce6.mp4","createTime":"1971-01-01 00:00:00","updateTime":"1971-01-01 00:00:00"},{"userName":"李四","mediaId":"9a9947bdea044678885769cd413e2878","resource":"https://mp4.vjshi.com/2019-12-09/5ef77dc687c0fb13e0fb6242b50074e1.mp4","createTime":"1971-01-01 00:00:00","updateTime":"1971-01-01 00:00:00"}]}',
  );
};

export const fetchComments = (mediaId: string) => {
  return axios.get(
    `http://106.54.76.130:8080/confucius/comment/getCommentList?mediaId=${mediaId}`,
  );
  //   return Promise.resolve({
  //     errNo: 0,
  //     errMsg: 'success',
  //     data: [
  //       {
  //         userName: '张三',
  //         commentId: '7fcf133384aa457997bb5d68663ff511',
  //         mediaId: '3451e401fc134abe9760613a687a0aee',
  //         content: '嗑死新垣结衣和堺雅人了！～',
  //         createTime: '1971-01-01 00:00:00',
  //         updateTime: '1971-01-01 00:00:00',
  //       },
  //     ],
  //   });
};

export const postComment = params => {
  return axios.post(
    `http://106.54.76.130:8080/confucius/comment/publicComment`,
    params,
  );
};

export const getAuthToken = () => {
  return axios.get(
    `http://106.54.76.130:8080/confucius/auth/getToken?product=Baidu`,
  );
};

export const postChat = params => {
  return axios.post(`http://106.54.76.130:8080/confucius/dialog/chat`, params);
};
