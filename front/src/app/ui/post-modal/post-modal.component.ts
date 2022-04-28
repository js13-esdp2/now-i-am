import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Post } from '../../models/post.model';
import { environment as env } from '../../../environments/environment';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/types';
import { Observable, Subscription } from 'rxjs';
import { fetchOneOfPostRequest, likePostRequest } from '../../store/posts.actions';
import { User } from '../../models/user.model';
import { onPostModalDataChange } from '../../store/posts.actions';

@Component({
  selector: 'app-post-modal',
  templateUrl: './post-modal.component.html',
  styleUrls: ['./post-modal.component.sass']
})
export class PostModalComponent implements OnInit, OnDestroy {
  user: Observable<null | User>;
  post: Observable<null | Post>;
  postLoading: Observable<boolean>;
  likeLoading: Observable<boolean>;

  apiUrl = env.apiUrl;
  userData: null | User = null;

  postId!: string;
  postData!: Post;

  private userSub!: Subscription;
  private postSub!: Subscription;

  constructor(
    public dialogRef: MatDialogRef<PostModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { postId: string },
    private store: Store<AppState>,
  ) {
    this.postId = data.postId;
    this.user = store.select((state) => state.users.user);
    this.post = store.select((state) => state.posts.post);
    this.postLoading = store.select((state) => state.posts.fetchLoading)
    this.likeLoading = store.select((state) => state.posts.likeLoading);

    store.dispatch(fetchOneOfPostRequest({ id: this.postId }));
  }

  ngOnInit(): void {
    this.userSub = this.user.subscribe((user) => {
      this.userData = user;
    });
    this.postSub = this.post.subscribe((post) => {
      if (post) {
        this.postData = post;
      }
    });
  }

  onClose(): void {
    this.dialogRef.close();
    if (this.user) {
      const postModalData = {post: null, searchTitle: ''};
      this.store.dispatch(onPostModalDataChange({postModalData}));
    }
  }

  checkUserLike(): boolean {
    return !!this.postData && !!this.postData.likes.find((like) => like.user === this.userData?._id);
  }

  likePost(): void {
    if (!this.userData) {
      return;
    }

    this.store.dispatch(likePostRequest({ id: this.postId }));
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
    this.postSub.unsubscribe();
  }
}
