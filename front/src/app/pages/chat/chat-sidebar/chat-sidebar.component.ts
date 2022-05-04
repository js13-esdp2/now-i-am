import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-chat-sidebar',
  templateUrl: './chat-sidebar.component.html',
  styleUrls: ['./chat-sidebar.component.sass']
})
export class ChatSidebarComponent implements OnInit {
  @Output() conversationClicked: EventEmitter<any> = new EventEmitter();
  searchText!: string;
  conversations = [
    {
      name: 'James',
      time: '8:21',
      latestMessage: 'Hi there!!',
      latestMessageRead: false,
      messages: [
        { id: 2, body: 'How are you?', time: '8:21', me: false },
        { id: 3, body: 'I am fine thanks', time: '8:21', me: true },
        { id: 4, body: 'Glad to hear that', time: '8:21', me: false },
      ],
    },
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
