import { Component } from '@angular/core';
import { AppState } from '../../../store/types';
import { Store } from '@ngrx/store';
import { ChatRoom } from '../../../models/chatRoom.model';
import { environment as env } from '../../../../environments/environment';
import { ChatService } from '../../../services/chat.service';
import { Message } from '../../../models/message.model';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.sass']
})
export class ChatRoomComponent {
  chatRoom!: ChatRoom;
  apiUrl = env.apiUrl;
  userID!: string | undefined;

  message = '';
  constructor(
    private store: Store<AppState>,
    private chatService: ChatService,
  ) {
    store.select(state => state.chat.chatRoom).subscribe(chatRoom => {
      if (chatRoom) this.chatRoom = chatRoom;
    });
    store.select(state => state.users.user).subscribe(user => {
      this.userID = user?._id;
    });
  }

  submitMessage(event: Event) {
    const messageData = {
      chatRoomInbox: this.chatRoom.chatRoomInbox,
      text: this.message,
      userFrom: this.chatRoom.owner._id,
      userTo: this.chatRoom.chattingWith._id,
    }

    this.chatService.sendMessage(messageData);
    this.message = '';
  }

  sendMessage() {
    const messageData = {
      chatRoomInbox: this.chatRoom.chatRoomInbox,
      text: this.message,
      userFrom: this.chatRoom.owner._id,
      userTo: this.chatRoom.chattingWith._id,
    }

    this.chatService.sendMessage(messageData);
    this.message = '';
  }

  checkIfMe(message: Message) {
    return message.userFrom === this.userID;
  }
}

