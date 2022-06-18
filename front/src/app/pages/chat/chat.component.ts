import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/types';
import { changeChatRoom, getUsersChatRooms } from '../../store/chat/chat.actions';
import { ChatRoom } from '../../models/chatRoom.model';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.sass']
})
export class ChatComponent implements OnInit, OnDestroy {
  chatRoom!: undefined | null | ChatRoom;
  userId!: string | undefined;

  constructor(
    private store: Store<AppState>,
  ) {
    store.select(state => (state.users.user)).subscribe(user => {
      this.userId = user?._id;
    });
    store.select(state => state.chat.chatRoom).subscribe(chatRoom => {
      this.chatRoom = chatRoom;
    })
  }

  ngOnInit(): void {
    this.store.dispatch(getUsersChatRooms({userId: this.userId}));
  }

  ngOnDestroy(): void {
    this.store.dispatch(changeChatRoom({chatRoom: null}));
  }
}
