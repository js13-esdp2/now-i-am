import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/types';
import { NgForm } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { checkCodeRequest } from '../../store/users/users.actions';
import { MatDialog } from '@angular/material/dialog';
import { LoginError, RecoveryData } from '../../models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recovery-modal',
  templateUrl: './recovery-modal.component.html',
  styleUrls: ['./recovery-modal.component.sass']
})
export class RecoveryModalComponent implements OnInit, OnDestroy{
  @ViewChild('f') form!: NgForm;

  recoveryData: Observable<null | RecoveryData>;
  loading: Observable<boolean>;
  error: Observable<null | LoginError>;
  recoveryDataSub!: Subscription;
  code!: null | string;

  constructor(
    private store: Store<AppState>,
    private dialog: MatDialog,
    private route: Router
  ) {
    this.recoveryData = store.select((state) => state.users.recoveryData);
    this.loading = store.select((state) => state.users.checkCodeLoading);
    this.error = store.select((state) => state.users.checkCodeError);
  }

  ngOnInit() {
    this.recoveryDataSub = this.recoveryData.subscribe( data => {
      this.code = <string>data?.code;
    });
  }

  onSubmit() {
    const code = this.form.value
    this.store.dispatch(checkCodeRequest(code));
    if (this.code === code.code) {
      this.dialog.closeAll();
      void this.route.navigate(['/login'])
    }
  }

  ngOnDestroy() {
    this.recoveryDataSub.unsubscribe();
  }
}
