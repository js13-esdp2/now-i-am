import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/types';
import { getUsersChatRooms } from '../../store/chat/chat.actions';
import { ChatRoom } from '../../models/chatRoom.model';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.sass']
})
export class ChatComponent implements OnInit {
  chatRoom!: undefined | null | ChatRoom;
  usersToken!: string | undefined;
  userId!: string | undefined;

  constructor(
    private chatService: ChatService,
    private store: Store<AppState>,
    ) {
    store.select(state => (state.users.user)).subscribe(user => {
      this.usersToken = user?.token;
      this.userId = user?._id;
    });
    store.select(state => state.chat.chatRoom).subscribe(chatRoom => {
      this.chatRoom = chatRoom;
    })
  }

  ngOnInit(): void {
    this.store.dispatch(getUsersChatRooms({userId: this.userId}));
  }
}
