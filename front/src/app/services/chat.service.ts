import { Injectable } from '@angular/core';
import { environment as env } from '../../environments/environment';
import { AppState } from '../store/types';
import { Store } from '@ngrx/store';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ChatRoom, ChatRoomData } from '../models/chatRoom.model';
import { MessageData } from '../models/message.model';
import { addNewMessageToChatRoom } from '../store/chat/chat.actions';
import { WebsocketService } from './websocket.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  myId!: string | undefined;

  constructor(
    private store: Store<AppState>,
    private http: HttpClient,
    private websocketService: WebsocketService,
  ) {
    store.select(state => state.users.user).subscribe(user => {
      this.myId = user?._id;
    })
    // this.websocketService.ws.onmessage = (event) => {
    //   const decodedMessage = JSON.parse(event.data);
    //   this.store.dispatch(addNewMessageToChatRoom({newMessage: decodedMessage.newMessage}));
    // }
  }

  sendMessage(messageData: MessageData) {
    this.websocketService.ws.send(JSON.stringify({
      type: 'NEW_MESSAGE',
      messageData: messageData,
    }));
      this.websocketService.ws.onmessage = (event) => {
        const decodedMessage = JSON.parse(event.data);
        this.store.dispatch(addNewMessageToChatRoom({newMessage: decodedMessage.newMessage}));
      }

      this.websocketService.onEvent('GET_MESSAGE').subscribe(messageData => {
        console.log(messageData);
      })
  }

  // getMessages() {
  //   this.websocketService.ws.onmessage = (event) => {
  //     const decodedMessage = JSON.parse(event.data);
  //     this.store.dispatch(addNewMessageToChatRoom({newMessage: decodedMessage.newMessage}));
  //   }
  // }

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
}


