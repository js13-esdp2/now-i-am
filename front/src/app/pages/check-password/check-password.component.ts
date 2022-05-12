import { Component, OnDestroy, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/types';
import { Observable, Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';
import { fetchPasswordRequest } from '../../store/users/users.actions';
import { MatDialog } from '@angular/material/dialog';
import { RecoveryModalComponent } from '../../ui/recovery-modal/recovery-modal.component';
import { LoginError, RecoveryData } from '../../models/user.model';

@Component({
  selector: 'app-check-password',
  templateUrl: './check-password.component.html',
  styles: [
  ]
})
export class CheckPasswordComponent implements  OnDestroy{
  @ViewChild('f') form!: NgForm;

  recoveryData: Observable<null | RecoveryData>;
  loading: Observable<boolean>;
  error: Observable<null | LoginError>;
  recoveryDataSub!: Subscription;
  userEmail!: string;

  constructor(
    private store: Store<AppState>,
    private dialog: MatDialog,
    ) {
    this.recoveryData = store.select((state) => state.users.recoveryData);
    this.loading = store.select((state) => state.users.fetchPasswordLoading);
    this.error = store.select((state) => state.users.fetchPasswordError);
  }

  onSubmit() {
    const email = this.form.value;
    if (email !== '') {
      this.store.dispatch(fetchPasswordRequest(email));
    }
    this.recoveryDataSub = this.recoveryData.subscribe( data => {
      this.userEmail = <string>data?.email;
      if (data) {
        this.dialog.open(RecoveryModalComponent);
      }
    });
  }

  ngOnDestroy() {
    if (this.userEmail){
      this.recoveryDataSub.unsubscribe();
    }
  }
}
