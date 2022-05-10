import { User } from './user.model';

export interface Message {
  _id: string,
  chatRoomInbox: string,
  text: string,
  createdAt: string,
  userFrom: string,
  userTo: string,
}


export interface MessageData {
  chatRoomInbox: string,
  text: string,
  userFrom: string,
  userTo: string,
}
