export class Comment {
  constructor(
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
  comment: string,
  postId: string,
  userId: string
}

export interface RemoveCommentData {
  commentId: string,
  userId: string,
  postId: string,
}
