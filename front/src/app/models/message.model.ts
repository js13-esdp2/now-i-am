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
