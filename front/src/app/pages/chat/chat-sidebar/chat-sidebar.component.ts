import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/types';
import { ChatRoom } from '../../../models/chatRoom.model';
import { environment } from '../../../../environments/environment';
import { changeChatRoom } from '../../../store/chat/chat.actions';

@Component({
  selector: 'app-chat-sidebar',
  templateUrl: './chat-sidebar.component.html',
  styleUrls: ['./chat-sidebar.component.sass']
})
export class ChatSidebarComponent {
  searchText!: string;
  chatRooms!: ChatRoom[];
  apiUrl = environment.apiUrl;

  constructor(private store: Store<AppState>) {
    store.select(state => state.chat.chatRooms).subscribe(chatRooms => {
      this.chatRooms = chatRooms;
    })
  }

  chatRoomClicked(chatRoom: ChatRoom) {
    this.store.dispatch(changeChatRoom({chatRoom}));
  }
}
