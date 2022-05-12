import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/types';
import { Observable, Subscription } from 'rxjs';
import { User } from '../../models/user.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-profile-modal',
  templateUrl: './profile-modal.component.html',
  styleUrls: ['./profile-modal.component.sass']
})
export class ProfileModalComponent implements OnInit, OnDestroy {
  friend: Observable<null | User>;
  loading: Observable<boolean>;
  error: Observable<null | string>;
  userSub!: Subscription;
  apiUrl = environment.apiUrl;
  friendData!: User;

  constructor(private store: Store<AppState>) {
    this.friend = this.store.select(state => state.users.friend);
    this.loading = this.store.select( state => state.users.fetchUserLoading);
    this.error = this.store.select( state => state.users.fetchUserError);
  }

  ngOnInit(): void {
    this.userSub = this.friend.subscribe( friend => {
      this.friendData = <User>friend;
    })
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
}
