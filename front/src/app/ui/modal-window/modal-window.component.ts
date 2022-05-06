import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/types';
import { removePostRequest } from '../../store/posts.actions';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-modal-window',
  templateUrl: './modal-window.component.html',
  styleUrls: ['./modal-window.component.sass']
})
export class ModalWindowComponent implements OnInit {
  removePost: boolean = false
  webcam: boolean = false;
  user!: Observable<User | null>
  user_id!: string;

  constructor(public dialogRef: MatDialogRef<ModalWindowComponent>,
              @Inject(MAT_DIALOG_DATA)
              public data: { removeData: {removePost: boolean, idPost: string} , webcam: boolean },
              private store: Store<AppState>) {}

  ngOnInit(): void {
    this.removePost = this.data.removeData.removePost;
    this.webcam = this.data.webcam;
  }

  closeModal() {
    this.dialogRef.close();
  }

  onRemovePost() {
    this.store.dispatch(removePostRequest({id: this.data.removeData.idPost}));
    this.dialogRef.close();
  }

}
