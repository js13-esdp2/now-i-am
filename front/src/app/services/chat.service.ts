import { Injectable } from '@angular/core';
import { environment as env } from '../../environments/environment';
import { AppState } from '../store/types';
import { Store } from '@ngrx/store';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ChatRoom, ChatRoomData } from '../models/chatRoom.model';
import { MessageData } from '../models/message.model';
import { addNewMessageToChatRoom } from '../store/chat/chat.actions';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  myId!: string | undefined;
  ws!: WebSocket;

  constructor(
    private store: Store<AppState>,
    private http: HttpClient,
  ) {
    store.select(state => state.users.user).subscribe(user => {
      this.myId = user?._id;
    })
  }

  openWebSocket(userId: undefined | string) {
    this.ws = new WebSocket(env.webSocketApiUrl);
    this.ws.onopen = (event) => {
      this.ws.send(JSON.stringify({
        type: 'LOGIN',
        userId: userId,
      }));
    };
    this.getMessages();
  }

  sendMessage(messageData: MessageData) {
    this.ws.send(JSON.stringify({
      type: 'NEW_MESSAGE',
      messageData: messageData,
    }));
  }

  getMessages() {
    this.ws.onmessage = (event) => {
      const decodedMessage = JSON.parse(event.data);
      this.store.dispatch(addNewMessageToChatRoom({newMessage: decodedMessage.newMessage}));
    }
  }

  reconnectWs() {
    this.ws.onclose = (event) => {
      setTimeout(() => {
        if (this.myId) {
          this.ws = new WebSocket(env.webSocketApiUrl);
          this.ws.send(JSON.stringify({
            type: 'LOGIN',
            userId: this.myId,
          }));
        }
      }, 3000);
    }
  }

  getUsersChatRooms(userId: string | undefined) {
    let params = new HttpParams();
    if (userId) params = params.append('ownerId', userId);
    return this.http.get<ChatRoom[]>(env.apiUrl + '/chat', {params});
  }

  newChatRoom(chatRoomData: ChatRoomData) {
    return this.http.post<ChatRoom>(env.apiUrl + '/chat', chatRoomData);
  }
}


