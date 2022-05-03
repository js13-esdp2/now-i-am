import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.sass']
})
export class ChatRoomComponent implements OnInit {
  @Input() conversation: any;
  @Output() onSubmit: EventEmitter<any> = new EventEmitter();
  // emojiPickerVisible;
  message = '';
  constructor() {}

  ngOnInit(): void {}

  submitMessage(event: Event) {
    console.log(event);
  }

  emojiClicked(event: Event) {
    console.log(event);
  }

}
