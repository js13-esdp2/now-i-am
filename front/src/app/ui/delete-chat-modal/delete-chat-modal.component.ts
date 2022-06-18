import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { ChatRoom, DialogDeleteData } from '../../models/chatRoom.model';
import { ChatRoomComponent } from '../../pages/chat/chat-room/chat-room.component';


@Component({
  selector: 'app-delete-chat-modal',
  templateUrl: './delete-chat-modal.component.html',
  styleUrls: ['./delete-chat-modal.component.sass']
})
export class DeleteChatModalComponent implements OnInit {
  deleteAll = false;

  constructor(
    public dialogRef: MatDialogRef<DeleteChatModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogDeleteData,
  ) {}

  delete(): void {
    if (this.deleteAll) {
      this.dialogRef.close();
      return;
    }
    this.dialogRef.close();
  }

  closeModal(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {

  }
}
