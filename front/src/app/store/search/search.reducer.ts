import { SearchState } from '../types';
import { createReducer, on } from '@ngrx/store';
import { searchUsersFailure, searchUsersRequest, searchUsersSuccess } from './search.actions';

const initialState: SearchState = {
  users: null,
  searchData: '',
  searchLoading: false,
  searchError: null,
  fetchLoading: false,
  fetchError: null,
};

export const searchReducer = createReducer(
  initialState,
  on(searchUsersRequest, state => ({...state, searchLoading: true, searchError: null})),
  on(searchUsersSuccess, (state, {users}) => ({...state, searchLoading: false, users})),
  on(searchUsersFailure, (state, {error}) => ({...state, searchLoading: false, searchError: error})),
)
