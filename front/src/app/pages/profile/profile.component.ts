import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/types';
import { environment as env } from '../../../environments/environment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.sass']
})
export class ProfileComponent {

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
    this.isLoading = store.select(state => state.users.registerLoading);
  }

  onChangePassword() {
    this.changePassword = !this.changePassword;
  }

  onSubmit() {
    this.changePassword = !this.changePassword;
  }
}
