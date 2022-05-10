import { Component, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/types';
import { environment as env } from '../../../environments/environment';
import { changeUserPasswordRequest } from '../../store/users/users.actions';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.sass']
})
export class ProfileComponent {
  @ViewChild('f') form!: NgForm;

  isLoading: Observable<boolean>;
  user: Observable<null | User>;
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

  onChangePassword() {
    this.changePassword = !this.changePassword;
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }
    const passwords = {
      newPassword: this.form.value.newPassword,
      currentPassword: this.form.value.currentPassword
    }
   this.store.dispatch(changeUserPasswordRequest({passwords: passwords}))
  }
}
