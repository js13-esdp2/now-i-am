import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { User } from '../../models/user.model';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/types';
import { environment as env } from '../../../environments/environment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.sass']
})
export class ProfileComponent implements OnInit, OnDestroy{

  isLoading: Observable<boolean>;
  user: Observable<null | User>;
  userSub!: Subscription;
  userEmail!: string;
  apiUrl = env.apiUrl

  constructor(
    private store: Store<AppState>,
  ) {
    this.user = store.select((state) => state.users.user);
    this.isLoading = store.select(state => state.users.changePasswordLoading);
  }

  ngOnInit() {
    this.userSub = this.user.subscribe( user => {
      this.userEmail = <string>user?.email;
    })
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
}
