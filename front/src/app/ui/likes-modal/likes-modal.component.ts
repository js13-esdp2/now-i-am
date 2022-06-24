import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiPostData } from '../../models/post.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-likes-modal',
  templateUrl: './likes-modal.component.html',
  styleUrls: ['./likes-modal.component.sass']
})
export class LikesModalComponent implements OnInit {
  postData!: ApiPostData;
  envApi = environment.apiUrl;

  constructor(
    public dialogRef: MatDialogRef<LikesModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ApiPostData,
  ) {}

  ngOnInit(): void {
    this.postData = this.data;
  }

  closeModal(): void {
    this.dialogRef.close();
  }
}
