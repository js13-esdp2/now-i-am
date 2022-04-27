import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { UsersService } from '../services/users.service';
import {
  editUserFailure,
  editUserRequest,
  editUserSuccess,
  loginFbFailure,
  loginFbRequest,
  loginFbSuccess,
  loginGoogleFailure,
  loginGoogleRequest,
  loginGoogleSuccess,
  loginUserFailure,
  loginUserRequest,
  loginUserSuccess,
  logoutUser,
  logoutUserRequest,
  registerUserFailure,
  registerUserRequest,
  registerUserSuccess
} from './users.actions';
import { map, mergeMap, tap } from 'rxjs';
import { Router } from '@angular/router';
import { HelpersService } from '../services/helpers.service';
import { Store } from '@ngrx/store';
import { AppState } from './types';
import { onPostModalDataChange } from './posts.actions';

@Injectable()
export class UsersEffects {

  constructor(
    private actions: Actions,
    private router: Router,
    private store: Store<AppState>,
    private usersService: UsersService,
    private helpersService: HelpersService,
  ) {
  }

  registerUser = createEffect(() => this.actions.pipe(
    ofType(registerUserRequest),
    mergeMap(({userData}) => this.usersService.register(userData).pipe(
      map((user) => registerUserSuccess({user})),
      tap(() => {
        this.helpersService.openSnackBar('Вы успешно зарегистрировались!');
        void this.router.navigate(['/search']);
      }),
      this.helpersService.catchServerError(registerUserFailure)
    )),
  ));

  editUser = createEffect(() => this.actions.pipe(
    ofType(editUserRequest),
    mergeMap(({userData}) => this.usersService.edit(userData).pipe(
      map((user) => editUserSuccess({user})),
      tap(() => {
        this.helpersService.openSnackBar('Информация успешно обновлена!');
        void this.router.navigate(['/profile']);
      }),
      this.helpersService.catchServerError(editUserFailure)
    )),
  ));

  loginUser = createEffect(() => this.actions.pipe(
    ofType(loginUserRequest),
    mergeMap(({userData}) => this.usersService.login(userData).pipe(
      map((user) => loginUserSuccess({user})),
      tap(() => {
        this.helpersService.openSnackBar('Вход успешно выполнен!');
        void this.router.navigate(['/search']);
      }),
      this.helpersService.catchServerError(loginUserFailure),
    )),
  ));

  loginUserFb = createEffect(() => this.actions.pipe(
    ofType(loginFbRequest),
    mergeMap(({userData}) => this.usersService.loginFb(userData).pipe(
      map(user => loginFbSuccess({user})),
      tap(() => {
        this.helpersService.openSnackBar('Вход успешно выполнен c Facebook!');
        void this.router.navigate(['/search']);
      }),
      this.helpersService.catchServerError(loginFbFailure)
    ))
  ));

  loginUserGoogle = createEffect(() => this.actions.pipe(
    ofType(loginGoogleRequest),
    mergeMap(({userData}) => this.usersService.loginGoogle(userData).pipe(
      map(user => loginGoogleSuccess({user})),
      tap(() => {
        this.helpersService.openSnackBar('Вход успешно выполнен c Google!');
        void this.router.navigate(['/search']);
      }),
      this.helpersService.catchServerError(loginGoogleFailure)
    ))
  ));

  logoutUser = createEffect(() => this.actions.pipe(
    ofType(logoutUserRequest),
    mergeMap(() => this.usersService.logout().pipe(
      map(() => logoutUser()),
      tap(() => {
        void this.router.navigate(['/login']);
        this.store.dispatch(onPostModalDataChange({postModalData: {post: null, searchTitle: ''}}));
        this.helpersService.openSnackBar('Выход выполнен!');
      }),
    )),
  ));
}
