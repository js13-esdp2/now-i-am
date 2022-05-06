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
  user: Observable<null | User>;
  loading: Observable<boolean>;
  // error: Observable<null | string>;
  userSub!: Subscription;
  apiUrl = environment.apiUrl;
  userData!: User;

  constructor(private store: Store<AppState>) {
    this.user = this.store.select(state => state.users.user);
    this.loading = this.store.select( state => state.users.loginLoading);
    // this.error = this.store.select( state => state.users.loginError);
  }

  ngOnInit(): void {
    this.userSub = this.user.subscribe( user => {
      this.userData = <User>user;
    })
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }

}
