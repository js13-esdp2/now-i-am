import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ActionType, Store } from '@ngrx/store';
import { catchError, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { PostModalData } from '../models/post.model';
import { AppState } from '../store/types';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class HelpersService {
  postModalData!: PostModalData;

  constructor(
    private snackBar: MatSnackBar,
    private store: Store<AppState>,
    private router: Router,
  ) {
    store.select(state => state.posts.postModalData).subscribe(postModalData => {
      this.postModalData = postModalData;
    })
  }

  openSnackBar(message: string, action?: string, config?: MatSnackBarConfig) {
    if (!action) {
      action = 'ОК';
    }

    if (!config || !config.duration) {
      config = {...config, duration: 3000, panelClass: ['mat-toolbar', 'mat-primary']};
    }

    return this.snackBar.open(message, action, config);
  }

  catchServerError(action: ActionType<any>) {
    return catchError((reqError) => {
      let error = null;

      if (reqError instanceof HttpErrorResponse && reqError.status === 400) {
        error = reqError.error;
        this.openSnackBar(error.error);
      } else {
        this.openSnackBar('Ошибка сервера');
      }

      return of(action({error}));
    });
  }

  showModal() {
    if (this.postModalData.postId) {
      void this.router.navigate(['/statistic'],
        {queryParams: {title: this.postModalData.searchTitle}});
    } else {
      void this.router.navigate(['/search']);
    }
  }
}
