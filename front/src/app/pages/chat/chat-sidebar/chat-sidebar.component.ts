import { Component, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/types';
import { ChatRoom } from '../../../models/chatRoom.model';
import { environment } from '../../../../environments/environment';
import { changeChatRoom, deleteChatRoomRequest } from '../../../store/chat/chat.actions';
import { MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'app-chat-sidebar',
  templateUrl: './chat-sidebar.component.html',
  styleUrls: ['./chat-sidebar.component.sass']
})
export class ChatSidebarComponent {
  @ViewChild(MatMenuTrigger) trigger!: MatMenuTrigger;
  searchText!: string;
  chatRooms!: ChatRoom[];
  apiUrl = environment.apiUrl;

  constructor(
    private store: Store<AppState>,
    ) {
    store.select(state => state.chat.chatRooms).subscribe(chatRooms => {
      this.chatRooms = chatRooms;
    })
  }

  chatRoomClicked(chatRoom: ChatRoom) {
    this.store.dispatch(changeChatRoom({chatRoom}));
  }

  deleteChatRoom(chatRoom: ChatRoom) {
    this.store.dispatch(deleteChatRoomRequest({chatRoom}));
  }
}
