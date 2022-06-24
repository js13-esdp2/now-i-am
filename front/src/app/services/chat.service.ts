import { Injectable } from '@angular/core';
import { environment as env } from '../../environments/environment';
import { AppState } from '../store/types';
import { Store } from '@ngrx/store';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ChatRoom, ChatRoomData } from '../models/chatRoom.model';
import { Message, MessageData, MessagesAreReadData, NewMessages } from '../models/message.model';
import {
  addNewMessageToChatRoom,
  addNewMessageToNewMessagesCounter,
  getUsersChatRooms
} from '../store/chat/chat.actions';
import { WebsocketService } from './websocket.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  myId!: string | undefined;
  chatRoom!: null | undefined | ChatRoom;

  constructor(
    private store: Store<AppState>,
    private http: HttpClient,
    private websocketService: WebsocketService,
  ) {
    store.select(state => state.users.user).subscribe(user => {
      this.myId = user?._id;
    });
    store.select(state => state.chat.chatRoom).subscribe(chatRoom => {
      this.chatRoom = chatRoom;
    })
    this.getMessages();
  }

  sendMessage(messageData: MessageData) {
    this.websocketService.send(JSON.stringify({
      type: 'NEW_MESSAGE',
      messageData: messageData,
    }));
  }

  getMessages() {
    // this.websocketService.onmessage = (event) => {
    //   const decodedMessage = JSON.parse(event.data);
    //   const newMessage = decodedMessage.newMessage;
    //
    //   if (this.chatRoom?.chatRoomInbox === newMessage.chatRoomInbox) {
    //     this.store.dispatch(addNewMessageToChatRoom({newMessage}));
    //   }
    //
    //   if (this.chatRoom?.chatRoomInbox === newMessage.chatRoomInbox && this.myId !== newMessage.userFrom) {
    //     const messageIsReadData = {
    //       ownerId: this.chatRoom?.chattingWith._id,
    //       chatRoomInbox: newMessage.chatRoomInbox,
    //       myId: this.myId,
    //     }
    //     this.messagesAreRead(messageIsReadData);
    //   } else if (this.chatRoom?.chatRoomInbox !== newMessage.chatRoomInbox && this.myId !== newMessage.userFrom) {
    //     this.store.dispatch(getUsersChatRooms({userId: this.myId}));
    //     this.store.dispatch(addNewMessageToNewMessagesCounter());
    //   }
    // }
  }

  messagesAreRead(messagesAreReadData: MessagesAreReadData) {
    return this.http.put<Message>(`${env.apiUrl}/messages/areRead`, {messagesAreReadData});
  }

  getUsersChatRooms(userId: string | undefined) {
    let params = new HttpParams();
    if (userId) params = params.append('ownerId', userId);
    return this.http.get<ChatRoom[]>(env.apiUrl + '/chat', {params});
  }

  newChatRoom(chatRoomData: ChatRoomData) {
    return this.http.post<ChatRoom>(env.apiUrl + '/chat', chatRoomData);
  }

  deleteChatRoom(chatRoom: ChatRoom) {
    return this.http.delete<ChatRoom>(env.apiUrl + '/chat/oneChatRoom', {body: chatRoom});
  }

  deleteMyMessages(chatRoom: ChatRoom) {
    return this.http.delete<ChatRoom | null | undefined>(
      env.apiUrl + '/chat/chatRoom/messages',
      {body: chatRoom});
  }

  deleteAllMessages(chatRoom: ChatRoom) {
    return this.http.delete<ChatRoom>(
      env.apiUrl + '/chat/chatRooms/allMessages',
      {body: chatRoom});
  }

  getChatRoomById(chatRoomId: string | null) {
    return this.http.get<ChatRoom>(`${env.apiUrl}/chat/${chatRoomId}`);
  }

  getUsersAllNewMessages(userId: string | undefined) {
    return this.http.get<NewMessages>(`${env.apiUrl}/messages/all/new/${userId}`);
  }
}


