export class Comment {
  constructor(
    public _id: string,
    public user: {
      _id: string,
      displayName: string,
      photo: string
    },
    public text: string,
    public postId: string
  ) {}
}


export interface CommentData {
  text: string,
  postId: string,
  userId: string
}

export interface RemoveCommentData {
  commentId: string,
  userId: string,
  postId: string,
}
