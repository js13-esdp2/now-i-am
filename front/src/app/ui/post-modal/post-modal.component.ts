import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Post } from '../../models/post.model';
import { environment as env } from '../../../environments/environment';

@Component({
  selector: 'app-post-modal',
  templateUrl: './post-modal.component.html',
  styleUrls: ['./post-modal.component.sass']
})
export class PostModalComponent {
  post!: Post;
  apiUrl = env.apiUrl;

  constructor(
    public dialogRef: MatDialogRef<PostModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { post: Post },
  ) {
    this.post = data.post;
  }

  onClose(): void {
    this.dialogRef.close();
  }

}
