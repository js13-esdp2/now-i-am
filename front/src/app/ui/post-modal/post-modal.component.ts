import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Post } from '../../models/post.model';
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
import { ChatService } from '../../services/chat.service';
import { createNewChatRoom } from '../../store/chat/chat.actions';
import { searchUsersRequest } from '../../store/search/search.actions';

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

  apiUrl = env.apiUrl;
  userData: null | User = null;

  postId!: string;
  postData!: Post;
  profileIsOpen = true;

  private usersSub!: Subscription;
  private userSub!: Subscription;
  private postSub!: Subscription;

  constructor(
    public dialogRef: MatDialogRef<PostModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { postId: string },
    private store: Store<AppState>,
    private router: Router,
    private chatService: ChatService,
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
    return !!this.postData.likes.find((like) => like.user === this.userData?._id);
  }

  likePost(): void {
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

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
    // this.usersSub.unsubscribe();
    this.postSub.unsubscribe();
  }

  closeProfile() {
    this.profileIsOpen = true;
  }

  removePost(id: string) {
    this.store.dispatch(removePostRequest({id}));
    this.dialogRef.close();
  }
}
