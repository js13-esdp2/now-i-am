import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';
import { Friends } from '../../models/frends.model';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/types';
import { fetchFriendsRequest, fetchUserRequest } from '../../store/users.actions';
import { ProfileComponent } from '../profile/profile.component';
import { MatDialog } from '@angular/material/dialog';
import { ProfileModalComponent } from '../../ui/profile-modal/profile-modal.component';

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

  constructor(
    private store: Store<AppState>,
    private dialog: MatDialog,
  ) {
    this.friends = store.select(state => state.users.friends);
    this.loading = store.select(state => state.users.fetchFriendsLoading);
    this.error = store.select(state => state.users.fetchFriendsError);
    this.user = store.select(state => state.users.user);
  }

  openProfileModal(userId: string) {
    this.store.dispatch(fetchUserRequest({userId}))
    this.dialog.open(ProfileModalComponent);
  }

  ngOnInit(): void {
    this.store.dispatch(fetchFriendsRequest());
  }

}
