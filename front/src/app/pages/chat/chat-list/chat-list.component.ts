import { Component, OnInit } from '@angular/core';
import { AppState } from '../../../store/types';
import { Store } from '@ngrx/store';
import { ChatRoom } from '../../../models/chatRoom.model';
import { deleteChatRoomRequest, getChatRoomByIdRequest } from '../../../store/chat/chat.actions';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';
import { ChatService } from '../../../services/chat.service';
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

  changeChatRoom(chatRoom: ChatRoom) {
    this.store.dispatch(getChatRoomByIdRequest({chatRoomId: chatRoom._id}));
    this.myControl.reset('');
  }

  displayFn(subject: any) {
    return subject ? subject.name : undefined;
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
