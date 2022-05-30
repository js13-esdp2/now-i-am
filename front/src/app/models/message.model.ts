export interface Message {
  _id: string,
  chatRoomInbox: string,
  text: string,
  createdAt: string,
  userFrom: string,
  userTo: string,
  isRead: boolean,
}

export interface MessageData {
  chatRoomInbox: string,
  text: string,
  userFrom: string,
  userTo: string,
  isRead: boolean,
}

export interface MessagesAreReadData {
  ownerId: string | undefined,
  chatRoomInbox: string,
  myId: string | undefined,
}

export interface NewMessages {
  user: string | undefined,
  allNewMessages: number,
}
