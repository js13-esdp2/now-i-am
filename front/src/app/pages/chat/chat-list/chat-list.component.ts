import { Component, OnInit } from '@angular/core';
import { AppState } from '../../../store/types';
import { Store } from '@ngrx/store';
import { ChatRoom } from '../../../models/chatRoom.model';
import { deleteChatRoomRequest, getChatRoomByIdRequest, getUsersChatRooms } from '../../../store/chat/chat.actions';
import { environment } from '../../../../environments/environment';
import { FormControl } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.sass'],
})
export class ChatListComponent implements OnInit {
  myControl = new FormControl();
  searchContact!: string;
  filteredChatRooms!: Observable<ChatRoom[]>;
  chatRooms!: ChatRoom[];
  userId!: string | undefined;
  apiUrl = environment.apiUrl;

  constructor(
    private store: Store<AppState>,
  ) {
    store.select(state => (state.users.user)).subscribe(user => {
      this.userId = user?._id;
      this.store.dispatch(getUsersChatRooms({userId: this.userId}));
    });
    store.select(state => state.chat.chatRooms).subscribe(chatRooms => {
      this.chatRooms = chatRooms;
    });
  }

  ngOnInit(): void {
    this.filteredChatRooms = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterChatRooms(value))
    )
  }

  private _filterChatRooms(value: string): ChatRoom[] {
    const filterValue = value.toString().toLowerCase();
    return this.chatRooms.filter(option =>
      option.name.toLowerCase().includes(filterValue)
    );
  }

  displayFn(subject: any) {
    return subject ? subject.name : undefined;
  }

  deleteChatRoom(chatRoom: ChatRoom) {
    this.store.dispatch(deleteChatRoomRequest({chatRoom}));
  }

  goToChatRoom(chatRoom: ChatRoom) {
    this.store.dispatch(getChatRoomByIdRequest({chatRoomId: chatRoom._id}));
  }

  checkIfThereAreNewMessages(newMessagesCounter: number) {
    return !!newMessagesCounter;
  }
}
