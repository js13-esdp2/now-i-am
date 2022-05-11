import { UsersState } from '../types';
import { createReducer, on } from '@ngrx/store';
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
  fetchFriendsSuccess,
  fetchPasswordFailure,
  fetchPasswordRequest,
  fetchPasswordSuccess,
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
  registerUserFailure,
  registerUserRequest,
  registerUserSuccess,
  removeFriendRequest,
  removeFriendSuccess
} from './users.actions';
import { User } from '../../models/user.model';

const initialState: UsersState = {
  user: null,
  friend: null,
  recoveryData: null,
  friends: [],
  capital: [],
  country: [],
  fetchLoading: false,
  fetchError: null,
  registerLoading: false,
  registerError: null,
  editLoading: false,
  editError: null,
  loginLoading: false,
  loginError: null,
  addFriendLoading: false,
  addFriendError: null,
  fetchFriendsLoading: false,
  fetchFriendsError: null,
  fetchUserLoading: false,
  fetchUserError: null,
  fetchPasswordLoading: false,
  fetchPasswordError: null,
  checkCodeLoading: false,
  checkCodeError: null,
  removeFriendLoading: false,
  removeFriendError: null,
  changePasswordLoading: false,
  changePasswordError: null,
};

const createUserClass = (user: User) => {
  return new User(
    user._id,
    user.email,
    user.displayName,
    user.token,
    user.role,
    user.friendRequests,
    user.photo,
    user.birthday,
    user.sex,
    user.country,
    user.city,
    user.aboutMe,
    user.isPrivate,
  );
};

export const usersReducer = createReducer(
  initialState,
  on(registerUserRequest, state => ({...state, registerLoading: true, registerError: null})),
  on(registerUserSuccess, (state, {user}) => ({...state, registerLoading: false, user: createUserClass(user)})),
  on(registerUserFailure, (state, {error}) => ({...state, registerLoading: false, registerError: error})),

  on(editUserRequest, state => ({...state, editLoading: true, editError: null})),
  on(editUserSuccess, (state, {user}) => ({...state, editLoading: false, user: createUserClass(user)})),
  on(editUserFailure, (state, {error}) => ({...state, editLoading: false, editError: error})),

  on(loginUserRequest, state => ({...state, loginLoading: true, loginError: null})),
  on(loginUserSuccess, (state, {user}) => ({...state, loginLoading: false, user: createUserClass(user)})),
  on(loginUserFailure, (state, {error}) => ({...state, loginLoading: false, loginError: error})),

  on(loginFbRequest, state => ({...state, loginLoading: true, loginError: null,})),
  on(loginFbSuccess, (state, {user}) => ({...state, loginLoading: false, user: createUserClass(user)})),
  on(loginFbFailure, (state, {error}) => ({...state, loginLoading: false, loginError: error})),

  on(loginGoogleRequest, state => ({...state, loginLoading: true, loginError: null,})),
  on(loginGoogleSuccess, (state, {user}) => ({...state, loginLoading: false, user: createUserClass(user)})),
  on(loginGoogleFailure, (state, {error}) => ({...state, loginLoading: false, loginError: error})),

  on(loginVKRequest, state => ({...state, loginLoading: true, loginError: null,})),
  on(loginVKSuccess, (state, {user}) => ({...state, loginLoading: false, user})),
  on(loginVKFailure, (state, {error}) => ({...state, loginLoading: false, loginError: error})),

  on(logoutUser, state => ({...state, user: null})),

  on(fetchUserRequest, state => ({...state, fetchUserLoading: true, fetchUserError: null,})),
  on(fetchUserSuccess, (state, { friend }) => ({...state, fetchUserLoading: false, friend})),
  on(fetchUserFailure, (state) => ({...state, fetchUserLoading: false, fetchUserError: ''})),

  on(addFriendRequest, state => ({...state, addFriendLoading: true, addFriendError: null,})),
  on(addFriendSuccess, (state, {user}) => ({...state, addFriendLoading: false, user: createUserClass(user)})),
  on(addFriendFailure, (state, {error}) => ({...state, addFriendLoading: false, addFriendError: error})),

  on(fetchFriendsRequest, state => ({...state, fetchFriendsLoading: true, fetchFriendsError: null,})),
  on(fetchFriendsSuccess, (state, {friends}) => ({...state, fetchFriendsLoading: false, friends})),
  on(fetchFriendsFailure, (state, {error}) => ({...state, fetchFriendsLoading: false, fetchFriendsError: error})),

  on(fetchCountriesRequest, state => ({...state, fetchLoading: true})),
  on(fetchCountriesSuccess, (state, {countries}) => ({...state, fetchLoading: false, country: countries})),
  on(fetchCountriesFailure, (state, {error}) => ({...state, fetchLoading: false, fetchError: error})),

  on(fetchPasswordRequest, state => ({...state, fetchPasswordLoading: true})),
  on(fetchPasswordSuccess, (state, {recoveryData}) => ({...state, fetchPasswordLoading: false, recoveryData})),
  on(fetchPasswordFailure, (state, {error}) => ({...state, fetchPasswordLoading: false, fetchPasswordError: error})),

  on(checkCodeRequest, state => ({...state, checkCodeLoading: true})),
  on(checkCodeSuccess, (state) => ({...state, checkCodeLoading: false})),
  on(checkCodeFailure, (state, {error}) => ({...state, checkCodeLoading: false, checkCodeError: error})),

  on(removeFriendRequest, (state, {friendId}) => {
    const array = state.friends.filter( friend => {
      return friend.friend._id !== friendId;
    });
    return {...state, friends: array, removeFriendLoading: true, removeFriendError: null,}}),
  on(removeFriendSuccess, (state) => ({...state, removeFriendLoading: false})),

  on(changeUserPasswordRequest, state => ({...state, changePasswordLoading: true, changePasswordError: null})),
  on(changeUserPasswordSuccess, state => ({...state, changePasswordLoading: false})),
  on(changeUserPasswordFailure, (state, {error}) => ({...state, changePasswordLoading: false, changePasswordError: error})),

);
