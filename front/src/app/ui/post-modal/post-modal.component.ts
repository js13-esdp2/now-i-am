import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Post } from '../../models/post.model';
import { environment as env } from '../../../environments/environment';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/types';
import { User } from '../../models/user.model';
import { onPostModalDataChange } from '../../store/posts.actions';

@Component({
  selector: 'app-post-modal',
  templateUrl: './post-modal.component.html',
  styleUrls: ['./post-modal.component.sass']
})
export class PostModalComponent {
  post!: Post;
  apiUrl = env.apiUrl;
  user!: null | User;

  constructor(
    public dialogRef: MatDialogRef<PostModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { post: Post },
    private store: Store<AppState>,
  ) {
    this.post = data.post;
    store.select(state => state.users.user).subscribe(user => {
      this.user = user;
    })
  }

  onClose(): void {
    this.dialogRef.close();
    if (this.user) {
      this.store.dispatch(onPostModalDataChange({post: null}));
    }
  }
}
