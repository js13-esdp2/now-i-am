import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ApiPostData, Post } from '../../models/post.model';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { environment as env } from '../../../environments/environment';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/types';
import { Observable, Subscription } from 'rxjs';
import {
  fetchOneOfPostRequest,
  likePostRequest,
  onPostModalDataChange,
  removePostRequest
} from '../../store/posts/posts.actions';
import { User } from '../../models/user.model';
import { addFriendRequest } from '../../store/users/users.actions';
import { Router } from '@angular/router';
import { createNewChatRoom } from '../../store/chat/chat.actions';
import { searchUsersRequest } from '../../store/search/search.actions';
import { CommentData, Comment } from '../../models/comment.model';
import {
  createCommentRequest,
  fetchCommentsRequest,
  removeCommentRequest
} from '../../store/comments/comments.actions';
import { LikesModalComponent } from '../likes-modal/likes-modal.component';

@Component({
  selector: 'app-post-modal',
  templateUrl: './post-modal.component.html',
  styleUrls: ['./post-modal.component.sass']
})
export class PostModalComponent implements OnInit, OnDestroy {
  myId!: string | undefined;
  user: Observable<null | User>;
  users: Observable<null | User[]>;
  post: Observable<null | Post>;
  postLoading: Observable<boolean>;
  likeLoading: Observable<boolean>;
  addFriendLoading: Observable<boolean>;
  commentsShow!: boolean;
  commentText!: string;
  apiUrl = env.apiUrl;
  userData!: null | User;
  like!: string;
  postId!: string;
  postData!: Post;
  profileIsOpen = true;
  comments: Observable<null| Comment[]>;
  loadingComments: Observable<boolean>;
  errorComments: Observable<string | null>;
  isBlock: boolean = false;


  private usersSub!: Subscription;
  private userSub!: Subscription;
  private postSub!: Subscription;


  constructor(
    public dialogRef: MatDialogRef<PostModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { postId: string },
    private store: Store<AppState>,
    private router: Router,
    private dialog: MatDialog,
  ) {
    this.postId = data.postId;
    this.user = store.select((state) => state.users.user);
    this.users = store.select((state) => state.search.users);
    this.post = store.select((state) => state.posts.post);
    this.postLoading = store.select((state) => state.posts.fetchLoading)
    this.likeLoading = store.select((state) => state.posts.likeLoading);
    this.addFriendLoading = store.select((state) => state.users.addFriendLoading);
    this.comments = store.select((state) => state.comments.comments);
    this.loadingComments = store.select((state) => state.comments.fetchLoading);
    this.errorComments = store.select((state) => state.comments.fetchError);

    store.select(state => state.users.user).subscribe(user => {
      this.userData = user;
    });
    store.select(state => state.users.user).subscribe(user => {
      this.myId = user?._id;
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
        post.likes.forEach(like =>{
          if(like.user._id === this.userData!._id){
            this.like = 'is-active';
          }
        })
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
    const chatRoomData = {
      participants: [this.myId, this.postData.user._id],
    }
    this.store.dispatch(createNewChatRoom({chatRoomData}));
    void this.router.navigate(['/chat'], {queryParams: {ownerId: this.userData?._id}});
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
    this.like = 'is-active';
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

  showComments(postId: string) {
    this.store.dispatch(fetchCommentsRequest({postId: postId}));
    this.commentsShow = !this.commentsShow;
    this.isBlock = !this.isBlock;
  }

  createComment() {
    const data: CommentData = {
      text: this.commentText,
      postId: this.postId,
      userId: this.userData!._id
    }
    this.store.dispatch(createCommentRequest({comment: data}));
    this.commentText = '';
  }

  removeComment(commentId: string){
    this.store.dispatch(removeCommentRequest({commentId: commentId}))
  }

  openLikesDialog(post: ApiPostData): void {
    const dialogRef = this.dialog.open(LikesModalComponent, {
      width: '400px',
      data: post,
    });
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
    if (this.usersSub){
      this.usersSub.unsubscribe();
    }
    this.postSub.unsubscribe();
  }

}
