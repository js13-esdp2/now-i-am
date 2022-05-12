export class Friends {
  constructor(
    public _id: string,
    public user: {
      _id: string,
      displayName: string,
      photo: string,
    },
    public friend: {
      _id: string,
      displayName: string,
      photo: string,
    },
    public isFriend: boolean,
  ) {}
}
