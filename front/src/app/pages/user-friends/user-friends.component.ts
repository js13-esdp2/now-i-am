import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';
import { Friends } from '../../models/frends.model';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/types';
import { fetchFriendsRequest } from '../../store/users.actions';

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

  constructor(private store: Store<AppState>) {
    this.friends = store.select(state => state.users.friends);
    this.loading = store.select(state => state.users.fetchFriendsLoading);
    this.error = store.select(state => state.users.fetchFriendsError);
    this.user = store.select(state => state.users.user);
  }

  ngOnInit(): void {
    this.store.dispatch(fetchFriendsRequest());
  }

}
