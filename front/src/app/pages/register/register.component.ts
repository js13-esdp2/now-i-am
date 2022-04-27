import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { LoginError, RegisterError } from '../../models/user.model';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/types';
import { loginFbRequest, loginGoogleRequest, registerUserRequest } from '../../store/users.actions';
import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthService, SocialUser } from 'angularx-social-login';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.sass']
})
export class RegisterComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('f') form!: NgForm;

  isLoading: Observable<boolean>;
  error: Observable<null | RegisterError>;
  errorLogin: Observable<null | LoginError>;
  authStateSub!: Subscription;
  loginFb = false;
  loginGoogle = false;
  hide = true;

  private errorSub!: Subscription;

  constructor(
    private store: Store<AppState>,
    private auth: SocialAuthService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.isLoading = store.select(state => state.users.registerLoading);
    this.error = store.select(state => state.users.registerError);
    this.isLoading = store.select((state) => state.users.loginLoading);
    this.errorLogin = store.select((state) => state.users.loginError);
  }

  ngOnInit() {
    this.authStateSub = this.auth.authState.subscribe((user: SocialUser) => {
      if (this.loginGoogle) {
        this.store.dispatch(loginGoogleRequest({userData: user}))
      }
      if (this.loginFb) {
        this.store.dispatch(loginFbRequest({userData: user}));
      }
    });
  }

  ngAfterViewInit(): void {
    this.errorSub = this.error.subscribe((error) => {
      const email = error?.errors.email?.message;
      if (email) {
        this.form.form.get('email')?.setErrors({serverError: email});
      } else {
        this.form.form.get('email')?.setErrors(null);
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }
    const userData = this.form.value;
    this.store.dispatch(registerUserRequest({ userData }));
  }


  fbLogin() {
    this.loginFb = true;
    void this.auth.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  googleLogin() {
    this.loginGoogle = true;
    void this.auth.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  ngOnDestroy(): void {
    this.errorSub.unsubscribe();
  }
}
