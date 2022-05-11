import { Component, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/types';
import { Observable } from 'rxjs';
import { NgForm } from '@angular/forms';
import { fetchPasswordRequest } from '../../store/users/users.actions';

@Component({
  selector: 'app-check-password',
  templateUrl: './check-password.component.html',
  styles: [
  ]
})
export class CheckPasswordComponent {
  @ViewChild('f') form!: NgForm;

  loading: Observable<boolean>;
  error: Observable<null | string>;

  constructor(
    private store: Store<AppState>,
    ) {
    this.loading = store.select((state) => state.users.fetchPasswordLoading);
    this.error = store.select((state) => state.users.fetchPasswordError);
  }

  onSubmit() {
    const email = this.form.value;
    this.store.dispatch(fetchPasswordRequest(email))
  }
}
