import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommentData, Post, RemoveCommentData } from '../../models/post.model';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ApiPostData, Post } from '../../models/post.model';
import { environment as env } from '../../../environments/environment';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/types';
import { Observable, Subscription } from 'rxjs';
import {
  createPostCommentRequest,
  fetchOneOfPostRequest,
  likePostRequest,
  onPostModalDataChange, removePostCommentRequest,
  removePostRequest
} from '../../store/posts/posts.actions';
import { User } from '../../models/user.model';
import { addFriendRequest } from '../../store/users/users.actions';
import { Router } from '@angular/router';
import { createNewChatRoom } from '../../store/chat/chat.actions';
import { searchUsersRequest } from '../../store/search/search.actions';
import { DeleteChatModalComponent } from '../delete-chat-modal/delete-chat-modal.component';
import { LikesModalComponent } from '../likes-modal/likes-modal.component';

@Component({
  selector: 'app-post-modal',
  templateUrl: './post-modal.component.html',
  styleUrls: ['./post-modal.component.sass']
})
export class PostModalComponent implements OnInit, OnDestroy {
  user: Observable<null | User>;
  users: Observable<null | User[]>;
  post: Observable<null | Post>;
  postLoading: Observable<boolean>;
  likeLoading: Observable<boolean>;
  addFriendLoading: Observable<boolean>;
  commentsShow!: boolean;
  comment!: string;
  apiUrl = env.apiUrl;
  userData: null | User = null;
  like!: string
  postId!: string;
  postData!: Post;
  profileIsOpen = true;

  private usersSub!: Subscription;
  private userSub!: Subscription;
  private postSub!: Subscription;


  constructor(
    public dialogRef: MatDialogRef<PostModalComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: { postId: string },
    private store: Store<AppState>,
    private router: Router,
  ) {
    this.postId = data.postId;
    this.user = store.select((state) => state.users.user);
    this.users = store.select((state) => state.search.users);
    this.post = store.select((state) => state.posts.post);
    this.postLoading = store.select((state) => state.posts.fetchLoading)
    this.likeLoading = store.select((state) => state.posts.likeLoading);
    this.addFriendLoading = store.select((state) => state.users.addFriendLoading);
    store.select(state => state.users.user).subscribe(user => {
      this.userData = user;
    });
    this.dialogRef.backdropClick().subscribe(() => {
      const postModalData = {postId: '', searchTitle: ''};
      this.store.dispatch(onPostModalDataChange({postModalData: postModalData}))
    })
    store.dispatch(fetchOneOfPostRequest({id: this.postId}));
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
    const postModalData = {postId: '', searchTitle: ''};
    this.store.dispatch(onPostModalDataChange({postModalData: postModalData}))
  }

  goToRegister() {
    this.dialogRef.close();
    void this.router.navigate(['/register']);
  }

  goToLogin() {
    this.dialogRef.close();
    void this.router.navigate(['/login']);
  }

  goToChat() {
    this.dialogRef.close();
    void this.router.navigate(['/chat'], {queryParams: {ownerId: this.userData?._id}});
    const chatRoomData = {
      participants: [this.userData?._id, this.postData.user._id],
    }
    this.store.dispatch(createNewChatRoom({chatRoomData}));
  }

  goToProfile(title: string, id: string) {
    const searchData = title;
    this.store.dispatch(searchUsersRequest({searchData}));

    this.usersSub = this.users.subscribe(arrayUsers => {
      arrayUsers?.forEach(user => {
        if (user._id === id) {
          this.profileIsOpen = false;
          this.userData = user;
        }
      })
    });
  }

  authorIsMe(): boolean {
    return this.postData.user._id === this.userData?._id;
  }

  checkUserLike(): boolean {
    return !!this.postData.likes.find((like) => like.user._id === this.userData?._id);
  }

  likePost(): void {
    this.like = 'is-active'
    if (!this.userData) {
      return;
    }
    this.store.dispatch(likePostRequest({id: this.postId}));
  }

  checkUserFriend(): boolean {
    return !!this.userData?.friendRequests.find((request) => request.user === this.postData.user._id);
  }

  addFriend(): void {
    this.store.dispatch(addFriendRequest({userId: this.postData.user._id}));
  }

  closeProfile() {
    this.profileIsOpen = true;
  }

  removePost(id: string) {
    this.store.dispatch(removePostRequest({id}));
    this.dialogRef.close();
  }

  showComments() {
    this.commentsShow = !this.commentsShow;
  }

  createComment() {
    const data: CommentData = {
      comment: this.comment,
      postId: this.postId,
    }
    this.store.dispatch(createPostCommentRequest({comment: data}))
  }

  removeComment(commentId: string){
    const data: RemoveCommentData = {
      commentId: commentId,
      postId: this.postId,
    }
    this.store.dispatch(removePostCommentRequest({comment: data}))
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
    // this.usersSub.unsubscribe();
    this.postSub.unsubscribe();
  }


  openLikesDialog(post: ApiPostData): void {
    const dialogRef = this.dialog.open(LikesModalComponent, {
      width: '400px',
      data: post,
    });
  }
}
