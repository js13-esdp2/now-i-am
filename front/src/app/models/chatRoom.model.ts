import { Message } from './message.model';
import { User } from './user.model';

export interface ChatRoom {
  _id: string,
  owner: User,
  chattingWith: User,
  name: String,
  chatRoomInbox: string,
  lastMessage: string,
  messages: Message[],
}


export interface ChatRoomData {
  participants: (string | undefined)[],
}

export interface DialogDeleteData {
  chatRoom: ChatRoom,
  deleteAll: Boolean,
}
