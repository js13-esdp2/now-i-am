import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { UsersService } from '../../services/users.service';
import {
  addFriendFailure,
  addFriendRequest,
  addFriendSuccess,
  checkCodeFailure,
  checkCodeRequest,
  checkCodeSuccess,
  changeUserPasswordFailure,
  changeUserPasswordRequest,
  changeUserPasswordSuccess,
  editUserFailure,
  editUserRequest,
  editUserSuccess,
  fetchCountriesFailure,
  fetchCountriesRequest,
  fetchCountriesSuccess,
  fetchFriendsFailure,
  fetchFriendsRequest,
  fetchFriendsSuccess, fetchPasswordFailure, fetchPasswordRequest, fetchPasswordSuccess,
  fetchUserFailure,
  fetchUserRequest,
  fetchUserSuccess,
  loginFbFailure,
  loginFbRequest,
  loginFbSuccess,
  loginGoogleFailure,
  loginGoogleRequest,
  loginGoogleSuccess,
  loginUserFailure,
  loginUserRequest,
  loginUserSuccess,
  loginVKFailure,
  loginVKRequest,
  loginVKSuccess,
  logoutUser,
  logoutUserRequest,
  registerUserFailure,
  registerUserRequest,
  registerUserSuccess,
  removeFriendRequest,
  removeFriendSuccess
} from './users.actions';
import { catchError, map, mergeMap, of, tap } from 'rxjs';
import { Router } from '@angular/router';
import { HelpersService } from '../../services/helpers.service';
import { Store } from '@ngrx/store';
import { AppState } from '../types';
import { onPostModalDataChange } from '../posts/posts.actions';
import { PostModalData } from '../../models/post.model';

@Injectable()
export class UsersEffects {
  postModalData!: PostModalData;

  constructor(
    private actions: Actions,
    private router: Router,
    private store: Store<AppState>,
    private usersService: UsersService,
    private helpersService: HelpersService,
  ) {
    store.select(state => state.posts.postModalData).subscribe(postModalData => {
      this.postModalData = postModalData;
    })
  }

  registerUser = createEffect(() => this.actions.pipe(
    ofType(registerUserRequest),
    mergeMap(({userData}) => this.usersService.register(userData).pipe(
      map((user) => registerUserSuccess({user})),
      tap(() => {
        this.helpersService.openSnackBar('Вы успешно зарегистрировались!');
        this.helpersService.showModal();
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

  fetchCountries = createEffect(() => this.actions.pipe(
    ofType(fetchCountriesRequest),
    mergeMap(() => this.usersService.getCountries().pipe(
      map(countries => fetchCountriesSuccess({countries})),
      catchError(() => of(fetchCountriesFailure({error: 'Нет такой страны!'})))
    ))
  ));

  loginUser = createEffect(() => this.actions.pipe(
    ofType(loginUserRequest),
    mergeMap(({userData}) => this.usersService.login(userData).pipe(
      map((user) => loginUserSuccess({user})),
      tap(() => {
        this.helpersService.openSnackBar('Вход успешно выполнен!');
        this.helpersService.showModal();
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
        this.helpersService.showModal();
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
        this.helpersService.showModal();
      }),
      this.helpersService.catchServerError(loginGoogleFailure)
    ))
  ));

  loginUserVK = createEffect(() => this.actions.pipe(
    ofType(loginVKRequest),
    mergeMap(({userData}) => this.usersService.loginVK(userData).pipe(
      map(user => loginVKSuccess({user})),
      tap(() => {
        this.helpersService.openSnackBar('Вход успешно выполнен c VK!');
        this.helpersService.showModal();
      }),
      this.helpersService.catchServerError(loginVKFailure)
    ))
  ));

  logoutUser = createEffect(() => this.actions.pipe(
    ofType(logoutUserRequest),
    mergeMap(() => this.usersService.logout().pipe(
      map(() => logoutUser()),
      tap(() => {
        void this.router.navigate(['/login']);
        this.store.dispatch(onPostModalDataChange({postModalData: {postId: '', searchTitle: ''}}));
        this.helpersService.openSnackBar('Выход выполнен!');
      }),
    )),
  ));

  // fetchUser = createEffect(() => this.actions.pipe(
  //   ofType(fetchUserRequest),
  //   mergeMap(({friendId}) => this.usersService.getUser(friendId).pipe(
  //     map(friend => fetchUserSuccess({friend})),
  //     this.helpersService.catchServerError(fetchUserFailure)
  //   )),
  // ));

  addFriend = createEffect(() => this.actions.pipe(
    ofType(addFriendRequest),
    mergeMap(({userId}) => this.usersService.addFriend(userId).pipe(
      map((user) => addFriendSuccess({user})),
      tap(() => {
        this.helpersService.openSnackBar('Запрос на дружбу успешно отправлен!');
      }),
      this.helpersService.catchServerError(addFriendFailure)
    ))
  ))

  fetchFriends = createEffect(() => this.actions.pipe(
    ofType(fetchFriendsRequest),
    mergeMap(() => this.usersService.getFriends().pipe(
      map((friends) => fetchFriendsSuccess({friends})),
      this.helpersService.catchServerError(fetchFriendsFailure)
    )),
  ));

  fetchPassword = createEffect(() => this.actions.pipe(
    ofType(fetchPasswordRequest),
    mergeMap(({email}) => this.usersService.getPassword(email).pipe(
      map((recoveryData) => fetchPasswordSuccess({recoveryData})),
      this.helpersService.catchServerError(fetchPasswordFailure)
    )),
  ));

  checkCode = createEffect(() => this.actions.pipe(
    ofType(checkCodeRequest),
    mergeMap(({code}) => this.usersService.checkCode(code).pipe(
      map(() => checkCodeSuccess()),
      this.helpersService.catchServerError(checkCodeFailure)
    )),
  ));

  removeFriend = createEffect(() => this.actions.pipe(
    ofType(removeFriendRequest),
    mergeMap(({friendId}) => this.usersService.removeFriend(friendId).pipe(
      map(() => removeFriendSuccess()),
      this.helpersService.catchServerError('Удаление завершено!')
    )),
  ));

  changePassword = createEffect(() => this.actions.pipe(
    ofType(changeUserPasswordRequest),
    mergeMap(({passwords}) => this.usersService.changePassword(passwords).pipe(
      map(() => changeUserPasswordSuccess()),
      tap(() => {
        this.helpersService.openSnackBar('Ваш пароль успешно изменен!');
        void this.router.navigate(['/']);
      }),
      this.helpersService.catchServerError(changeUserPasswordFailure)
    )),
  ))

}
