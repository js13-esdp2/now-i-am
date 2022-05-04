import { Message } from './message.model';

export interface ChatRoom {
  _id: string,
  name: string,
  time: string,
  latestMessage: string,
  latestMessageRead: boolean,
  messages: Message[],
}
