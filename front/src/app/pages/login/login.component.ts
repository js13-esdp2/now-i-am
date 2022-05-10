import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { LoginError } from '../../models/user.model';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/types';
import { NgForm } from '@angular/forms';
import { loginFbRequest, loginGoogleRequest, loginUserRequest, loginVKRequest } from '../../store/users/users.actions';
import {
  FacebookLoginProvider,
  GoogleLoginProvider,
  SocialAuthService,
  SocialUser,
  VKLoginProvider
} from 'angularx-social-login';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit, OnDestroy {
  @ViewChild('f') form!: NgForm;

  isLoading: Observable<boolean>;
  error: Observable<null | LoginError>;
  authStateSub!: Subscription;
  loginFb = false;
  loginGoogle = false;
  loginVK = false;

  constructor(
    private store: Store<AppState>,
    private auth: SocialAuthService,
  ) {
    this.isLoading = store.select((state) => state.users.loginLoading);
    this.error = store.select((state) => state.users.loginError);
  }

  ngOnInit() {
    this.authStateSub = this.auth.authState.subscribe((user: SocialUser) => {
      if (this.loginGoogle) {
        this.store.dispatch(loginGoogleRequest({userData: user}))
      }
      if (this.loginFb) {
        this.store.dispatch(loginFbRequest({userData: user}));
      }
      if(this.loginVK) {
        this.store.dispatch(loginVKRequest({userData: user}));
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    const userData = this.form.value;
    this.store.dispatch(loginUserRequest({ userData }));
  }

  fbLogin() {
    this.loginFb = true;
    void this.auth.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  googleLogin() {
    this.loginGoogle = true;
    void this.auth.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  vkLogin() {
    this.loginVK = true;
    void this.auth.signIn(VKLoginProvider.PROVIDER_ID);
  }

  ngOnDestroy() {
    this.authStateSub.unsubscribe();
  }
}
