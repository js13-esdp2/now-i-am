import { createAction, props } from '@ngrx/store';
import { User } from '../../models/user.model';

export const searchUsersRequest = createAction(
  '[Users] Search Request',
  props<{ searchData: string }>()
);
export const searchUsersSuccess = createAction(
  '[Users] Search Success',
  props<{ users: User[] }>()
);
export const searchUsersFailure = createAction(
  '[Users] Search Failure',
  props<{ error: string }>()
);
