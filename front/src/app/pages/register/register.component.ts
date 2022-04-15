import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { RegisterError } from '../../models/user.model';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/types';
import { registerUserRequest } from '../../store/users.actions';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.sass']
})
export class RegisterComponent {
  @ViewChild('f') form!: NgForm;

  isLoading: Observable<boolean>;
  error: Observable<null | RegisterError>;
  hide = true;

  constructor(
    private store: Store<AppState>,
  ) {
    this.isLoading = store.select(state => state.users.registerLoading);
    this.error = store.select(state => state.users.registerError);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }
    const userData = this.form.value;
    this.store.dispatch(registerUserRequest({ userData }));
  }
}
