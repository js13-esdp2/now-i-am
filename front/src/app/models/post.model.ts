
export class Post {
  constructor(
    public _id: string,
    public user: {
      _id: string,
      displayName: string,
      photo: string
    },
    public title: string,
    public content: string,
    public datetime: string,
    public time: {
      hours: number,
      minutes: number
    },
    public likes: {
      _id: string,
      user: {
        displayName: string,
        photo: string,
        _id: string,
      }
    }[],
    public geolocation: {
      lat: number
      lng: number
    },
    public comments: [{
      text: string,
      user: {
        _id: string,
        displayName: string,
        photo: string
      },
      _id: string
    }]
  ) {
  }
}

export interface FilterData {
  title: string,
  birthday: string,
  country: string,
  city: string,
  sex: string,
  isPrivate: string,
}

export interface PostModalData {
  postId: string,
  searchTitle: string,
}

export interface PostData {
  [key: string]: any,

  user: string,
  title: string,
  content: File | string | null,
  geolocation: string | null
}

export interface ApiPostData {
  _id: string,
  user: {
    _id: string,
    displayName: string,
    photo: string
  },
  title: string,
  datetime: string,
  content: string,
  time: {
    hours: number,
    minutes: number
  },
  likes: {
    _id: string,
    user: {
      displayName: string,
      photo: string,
      _id: string,
    }
  }[]
  geolocation: {
    lat: number,
    lng: number
  },
  comments: [{
    text: string,
    user: {
      _id: string,
      displayName: string,
      photo: string
    },
    _id: string
    }
  ]
}

