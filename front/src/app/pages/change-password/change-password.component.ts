import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { User } from '../../models/user.model';
import { environment as env } from '../../../environments/environment';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/types';
import { changeUserPasswordRequest } from '../../store/users/users.actions';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.sass']
})
export class ChangePasswordComponent implements OnInit, OnDestroy {
  @ViewChild('f') form!: NgForm;

  isLoading: Observable<boolean>;
  user: Observable<null | User>;
  userSub!: Subscription;
  userEmail!: string;
  apiUrl = env.apiUrl
  changePassword: boolean = false;
  newPasswordHide = true;
  newPasswordRepeatHide = true;
  currentPasswordHide = true;

  constructor(
    private store: Store<AppState>,
  ) {
    this.user = store.select((state) => state.users.user);
    this.isLoading = store.select(state => state.users.changePasswordLoading);
  }

  ngOnInit(): void {
    this.userSub = this.user.subscribe( user => {
      this.userEmail = <string>user?.email;
    })
  }

  onChangePassword() {
    this.changePassword = !this.changePassword;
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }
    const passwords = {
      email: this.userEmail,
      newPassword: this.form.value.newPassword,
      currentPassword: this.form.value.currentPassword
    }
    this.store.dispatch(changeUserPasswordRequest({passwords: passwords}))
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
}
