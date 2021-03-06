import { Component, OnDestroy, OnInit } from '@angular/core';
import { DeleteChatModalComponent } from '../../../ui/delete-chat-modal/delete-chat-modal.component';
import { ChatRoom, DialogDeleteData } from '../../../models/chatRoom.model';
import { environment as env } from '../../../../environments/environment';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/types';
import { ChatService } from '../../../services/chat.service';
import { MatDialog } from '@angular/material/dialog';
import { Message } from '../../../models/message.model';
import {
  changeChatRoom, decreaseMessagesCounter,
  deleteAllMessages,
  deleteMyMessages,
  getChatRoomByIdRequest, getUsersChatRooms
} from '../../../store/chat/chat.actions';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.sass']
})
export class ChatRoomComponent implements OnInit, OnDestroy {
  deleteAll = false;
  chatRoomLoading!: Observable<boolean>;
  chatRoom!: ChatRoom;
  apiUrl = env.apiUrl;
  userID!: string | undefined;
  toggled: boolean = false;
  message = '';

  constructor(
    private store: Store<AppState>,
    private chatService: ChatService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
  ) {
    store.select(state => state.chat.chatRoom).subscribe(chatRoom => {
      if (chatRoom) {
        this.chatRoom = chatRoom;
        this.store.dispatch(changeChatRoom({chatRoom}));
        this.store.dispatch(decreaseMessagesCounter({decreaseNumber: chatRoom.newMessagesCounter}))
      }
    });
    store.select(state => state.users.user).subscribe(user => {
      this.userID = user?._id;
    });
    this.chatRoomLoading = store.select(state => state.chat.fetchLoading);
  }

  ngOnInit(): void {
    const chatRoomId = this.route.snapshot.paramMap.get('id');
    if (chatRoomId) {
      this.store.dispatch(getChatRoomByIdRequest({chatRoomId}));
      this.store.dispatch(getUsersChatRooms({userId: this.userID}));
    }
  }

  sendMessageByEnter(event: Event) {
    this.sendMessage();
  }

  sendMessageByClick() {
    this.sendMessage();
  }

  sendMessage() {
    if (this.message) {
      const messageData = {
        chatRoomInbox: this.chatRoom.chatRoomInbox,
        text: this.message,
        userFrom: this.chatRoom.owner._id,
        userTo: this.chatRoom.chattingWith._id,
        isRead: false,
      }

      this.chatService.sendMessage(messageData);
      this.message = '';
    }
  }

  checkIfMe(message: Message) {
    return message.userFrom === this.userID;
  }

  openDialog(): void {
    const dialogData = {
      chatRoom: this.chatRoom,
      deleteAll: this.deleteAll,
    }
    const dialogRef = this.dialog.open(DeleteChatModalComponent, {
      width: '350px',
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe(dialogDeleteData => {
      this.deleteChatMessages(dialogDeleteData);
    });
  }

  deleteChatMessages(deleteData: DialogDeleteData) {
    const chatRoom = deleteData.chatRoom;
    if (deleteData) {
      if (deleteData.deleteAll) {
        this.store.dispatch(deleteAllMessages({chatRoom}));
      } else {
        this.store.dispatch(deleteMyMessages({chatRoom}));
      }
    }
  }

  handleSelection(event: any) {
    this.message += event.char;
  }

  ngOnDestroy(): void {
    this.store.dispatch(changeChatRoom({chatRoom: null}));
  }
}
