import { UsersState } from './types';
import { createReducer, on } from '@ngrx/store';
import {
  editUserFailure,
  editUserRequest,
  editUserSuccess,
  loginFbFailure,
  loginFbRequest,
  loginFbSuccess, loginGoogleFailure,
  loginGoogleRequest,
  loginGoogleSuccess,
  loginUserFailure,
  loginUserRequest,
  loginUserSuccess,
  logoutUser,
  registerUserFailure,
  registerUserRequest,
  registerUserSuccess
} from './users.actions';

const initialState: UsersState = {
  user: null,
  registerLoading: false,
  registerError: null,
  editLoading: false,
  editError: null,
  loginLoading: false,
  loginError: null
};

export const usersReducer = createReducer(
  initialState,
  on(registerUserRequest, state => ({...state, registerLoading: true, registerError: null})),
  on(registerUserSuccess, (state, {user}) => ({...state, registerLoading: false, user})),
  on(registerUserFailure, (state, {error}) => ({...state, registerLoading: false, registerError: error})),

  on(editUserRequest, state => ({...state, editLoading: true, editError: null})),
  on(editUserSuccess, (state, {user}) => ({...state, editLoading: false, user})),
  on(editUserFailure, (state, {error}) => ({...state, editLoading: false, editError: error})),

  on(loginUserRequest, state => ({...state, loginLoading: true, loginError: null})),
  on(loginUserSuccess, (state, {user}) => ({...state, loginLoading: false, user})),
  on(loginUserFailure, (state, {error}) => ({...state, loginLoading: false, loginError: error})),

  on(loginFbRequest, state => ({...state, loginLoading: true, loginError: null,})),
  on(loginFbSuccess, (state, {user}) => ({...state, loginLoading: false, user})),
  on(loginFbFailure, (state, {error}) => ({...state, loginLoading: false, loginError: error})),

  on(loginGoogleRequest, state => ({...state, loginLoading: true, loginError: null,})),
  on(loginGoogleSuccess, (state, {user}) => ({...state, loginLoading: false, user})),
  on(loginGoogleFailure, (state, {error}) => ({...state, loginLoading: false, loginError: error})),


  on(logoutUser, state => ({...state, user: null})),
);
