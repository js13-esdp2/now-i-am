import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { LoginError, User } from '../../models/user.model';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/types';
import { NgForm } from '@angular/forms';
import { loginUserRequest, loginUserSuccess } from '../../store/users.actions';
import { FacebookLoginProvider, SocialAuthService, SocialUser } from 'angularx-social-login';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

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

  constructor(
    private store: Store<AppState>,
    private auth: SocialAuthService,
    private http: HttpClient,
  ) {
    this.isLoading = store.select((state) => state.users.loginLoading);
    this.error = store.select((state) => state.users.loginError);
  }

  ngOnInit() {
    this.authStateSub = this.auth.authState.subscribe((user: SocialUser) => {
      this.http.post<User>(environment.apiUrl + '/users/facebookLogin', {
        authToken: user.authToken,
        id: user.id,
        email: user.email,
        name: user.name,
        photoUrl: user.photoUrl
      }).subscribe(user => {
        this.store.dispatch(loginUserSuccess({user}));
      });
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
    void this.auth.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  ngOnDestroy() {
    this.authStateSub.unsubscribe();
  }
}
