import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';
import { Friends } from '../../models/frends.model';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/types';
import { fetchFriendsRequest, fetchUserRequest, removeFriendRequest } from '../../store/users/users.actions';
import { MatDialog } from '@angular/material/dialog';
import { ProfileModalComponent } from '../../ui/profile-modal/profile-modal.component';
import { createNewChatRoom } from '../../store/chat/chat.actions';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-friends',
  templateUrl: './user-friends.component.html',
  styleUrls: ['./user-friends.component.sass']
})
export class UserFriendsComponent implements OnInit {
  friends: Observable<Friends[]>;
  loading: Observable<boolean>;
  error: Observable<null | string>;
  user: Observable<User | null>;
  userData!: User;

  constructor(
    private store: Store<AppState>,
    private dialog: MatDialog,
    private router: Router,
  ) {
    this.friends = store.select(state => state.users.friends);
    this.loading = store.select(state => state.users.fetchFriendsLoading);
    this.error = store.select(state => state.users.fetchFriendsError);
    this.user = store.select(state => state.users.user);
  }

  openProfileModal(friendId: string) {
    this.store.dispatch(fetchUserRequest({friendId}))
    this.dialog.open(ProfileModalComponent);
  }

  ngOnInit(): void {
    this.user.subscribe(user => {
      this.userData = user!
    })
    this.store.dispatch(fetchFriendsRequest());
  }

  goToChat(idFriend: string) {
    const chatRoomData = {
      participants: [this.userData._id, idFriend],
    }
    this.store.dispatch(createNewChatRoom({chatRoomData}));
    void this.router.navigate(['/chat'], {queryParams: {ownerId: this.userData?._id}});
  }

  removeFriend(friendId: string) {
    this.store.dispatch(removeFriendRequest({friendId}));
  }
}
