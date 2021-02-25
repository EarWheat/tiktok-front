export interface Media {
  userName: string;
  mediaId: string;
  resource: string;
  createTime: string;
  updateTime: string;
}

export interface Comment {
  userName: string;
  commentId: string;
  mediaId: string;
  content: string;
  createTime: string;
  updateTime: string;
}
