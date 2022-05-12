import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/types';
import { NgForm } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { changeUserPasswordRequest, checkCodeRequest } from '../../store/users/users.actions';
import { MatDialog } from '@angular/material/dialog';
import { LoginError, RecoveryData } from '../../models/user.model';

@Component({
  selector: 'app-recovery-modal',
  templateUrl: './recovery-modal.component.html',
  styleUrls: ['./recovery-modal.component.sass']
})
export class RecoveryModalComponent implements OnInit, OnDestroy{
  @ViewChild('f') form!: NgForm;

  recoveryData: Observable<null | RecoveryData>;
  loading: Observable<boolean>;
  isLoading: Observable<boolean>;
  error: Observable<null | LoginError>;
  recoveryDataSub!: Subscription;
  code!: null | string;
  userEmail!: string;
  correctCode = true;
  changePassword: boolean = false;
  newPasswordHide = true;
  newPasswordRepeatHide = true;
  currentPasswordHide = true;

  constructor(
    private store: Store<AppState>,
    private dialog: MatDialog,
  ) {
    this.recoveryData = store.select((state) => state.users.recoveryData);
    this.loading = store.select((state) => state.users.checkCodeLoading);
    this.error = store.select((state) => state.users.checkCodeError);
    this.isLoading = store.select(state => state.users.changePasswordLoading);
  }

  ngOnInit() {
    this.recoveryDataSub = this.recoveryData.subscribe( data => {
      this.code = <string>data?.code;
      this.userEmail = <string>data?.email;
    });
  }

  onSubmitCode() {
    const code = this.form.value
    this.store.dispatch(checkCodeRequest(code));
    if (this.code === code.code) {
      this.correctCode = false;
    }
  }

  onSubmitNewPassword(){
    if (this.form.invalid) {
      return;
    }
    const passwords = {
      email: this.userEmail,
      newPassword: this.form.value.newPassword,
      currentPassword: null
    }
    this.store.dispatch(changeUserPasswordRequest({passwords: passwords}));
    this.dialog.closeAll();
  }

  ngOnDestroy() {
    if (this.code){
      this.recoveryDataSub.unsubscribe();
    }
  }
}
