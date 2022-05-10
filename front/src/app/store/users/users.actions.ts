import { createAction, props } from '@ngrx/store';
import {
  ApiCountryData,
  EditUserData,
  EditUserError,
  LoginError,
  LoginUserData,
  RegisterError,
  RegisterUserData,
  User
} from '../../models/user.model';
import { SocialUser } from 'angularx-social-login';
import { Friends } from '../../models/frends.model';

export const registerUserRequest = createAction('[Users] Register Request', props<{userData: RegisterUserData}>());
export const registerUserSuccess = createAction('[Users] Register Success', props<{user: User}>());
export const registerUserFailure = createAction('[Users] Register Failure', props<{error: null | RegisterError}>());

export const editUserRequest = createAction('[Users] Edit Request', props<{userData: EditUserData}>());
export const editUserSuccess = createAction('[Users] Edit Success', props<{user: User}>());
export const editUserFailure = createAction('[Users] Edit Failure', props<{error: null | EditUserError}>());

export const loginUserRequest = createAction('[Users] Login Request', props<{userData: LoginUserData}>());
export const loginUserSuccess = createAction('[Users] Login Success', props<{user: User}>());
export const loginUserFailure = createAction('[Users] Login Failure', props<{error: null | LoginError}>());

export const loginFbRequest = createAction('[Users] Login Fb Request', props<{userData: SocialUser}>());
export const loginFbSuccess = createAction('[Users] Login Fb Success', props<{user: User}>());
export const loginFbFailure = createAction('[Users] Login Fb Failure', props<{error: null | LoginError}>());

export const loginGoogleRequest = createAction('[Users] Login Google Request', props<{userData: SocialUser}>());
export const loginGoogleSuccess = createAction('[Users] Login Google Success', props<{user: User}>());
export const loginGoogleFailure = createAction('[Users] Login Google Failure', props<{error: null | LoginError}>());

export const loginVKRequest = createAction('[Users] Login VK Request', props<{userData: SocialUser}>());
export const loginVKSuccess = createAction('[Users] Login VK Success', props<{user: User}>());
export const loginVKFailure = createAction('[Users] Login VK Failure', props<{error: null | LoginError}>());

export const logoutUser = createAction('[Users] Logout');
export const logoutUserRequest = createAction('[Users] Logout Request');

export const fetchUserRequest = createAction('[Users] Fetch User Request', props<{friendId: string}>());
export const fetchUserSuccess = createAction('[Users] Fetch User Success', props<{friend: User}>());
export const fetchUserFailure = createAction('[Users] Fetch User Failure', props<{error: string}>());

export const addFriendRequest = createAction('[Users] Add Friend Request', props<{userId: string}>());
export const addFriendSuccess = createAction('[Users] Add Friend Success', props<{user: User}>());
export const addFriendFailure = createAction('[Users] Add Friend Failure', props<{error: string}>());

export const fetchFriendsRequest = createAction('[Users] Fetch Friends Request');
export const fetchFriendsSuccess = createAction('[Users] Fetch Friends Success', props<{friends: Friends[]}>());
export const fetchFriendsFailure = createAction('[Users] Fetch Friends Failure', props<{error: string}>());

export const fetchCountriesRequest = createAction('[Country] Fetch Request');
export const fetchCountriesSuccess = createAction('[Country] Fetch Success', props<{countries: ApiCountryData[]}>());
export const fetchCountriesFailure = createAction('[Country] Fetch Failure', props<{ error: string }>());

export const removeFriendRequest = createAction('[Users] Remove Friend Request', props<{friendId: string}>());
export const removeFriendSuccess = createAction('[Users] Remove Friend Success');
