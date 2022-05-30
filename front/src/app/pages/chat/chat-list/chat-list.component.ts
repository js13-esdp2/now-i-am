import { Component, OnInit } from '@angular/core';
import { AppState } from '../../../store/types';
import { Store } from '@ngrx/store';
import { ChatRoom } from '../../../models/chatRoom.model';
import {
  deleteChatRoomRequest,
  getChatRoomByIdRequest,
  getUsersChatRooms
} from '../../../store/chat/chat.actions';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';
import { ChatService } from '../../../services/chat.service';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.sass'],
})
export class ChatListComponent implements OnInit {
  chatRooms!: ChatRoom[];
  userId!: string | undefined;
  apiUrl = environment.apiUrl;

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private chatService: ChatService,
  ) {
    store.select(state => (state.users.user)).subscribe(user => {
      this.userId = user?._id;
    });
    store.select(state => state.chat.chatRooms).subscribe(chatRooms => {
      this.chatRooms = chatRooms;
    });
  }

  ngOnInit(): void {
    this.store.dispatch(getUsersChatRooms({userId: this.userId}));
  }

  deleteChatRoom(chatRoom: ChatRoom) {
    this.store.dispatch(deleteChatRoomRequest({chatRoom}));
  }

  goToChatRoom(chatRoom: ChatRoom) {
    const messagesAreReadData = {
      ownerId: chatRoom.owner._id,
      chatRoomInbox: chatRoom.chatRoomInbox,
      myId: this.userId,
    }
    this.store.dispatch(getChatRoomByIdRequest({chatRoomId: chatRoom._id}));
    this.chatService.messagesAreRead(messagesAreReadData);
  }

  checkIfThereAreNewMessages(newMessagesCounter: number) {
    return !!newMessagesCounter;
  }
}
