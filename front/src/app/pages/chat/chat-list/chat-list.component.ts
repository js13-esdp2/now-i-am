import { Component, OnInit } from '@angular/core';
import { AppState } from '../../../store/types';
import { Store } from '@ngrx/store';
import { ChatRoom } from '../../../models/chatRoom.model';
import { changeChatRoom, deleteChatRoomRequest, getUsersChatRooms } from '../../../store/chat/chat.actions';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';

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
    if (this.router.url === '/chat') {
      this.store.dispatch(changeChatRoom({chatRoom}));
    } else {
      void this.router.navigate([`/chat-room-mobile/${chatRoom._id}`]);
    }
  }
}
