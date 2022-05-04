import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.sass']
})
export class ChatComponent {
  conversation: any;


  onConversationSelected(conversation: any){
    this.conversation = conversation;
  }
}
