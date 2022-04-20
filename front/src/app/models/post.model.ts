export class Post{
  constructor(
    public _id: string,
    public user: {
      _id: string,
      displayName: string
    },
    public title: string,
    public content: string,
    public datetime: string,
    public time: {
      hours: number,
      minutes: number
    },
  ) {}
}

export interface PostData {
  [key: string]: any,
  user: string,
  title: string,
  content: File | string | null,
}

export interface ApiPostData {
  _id: string,
  user: {
    _id: string,
    displayName: string
  },
  title: string,
  datetime: string,
  content: string,
  time: {
    hours: number,
    minutes: number
  },
}
