import { createReducer, on } from '@ngrx/store';
import { CommentsState } from '../types';
import { fetchCommentsFailure, fetchCommentsRequest, fetchCommentsSuccess } from './comments.actions';

const initialState: CommentsState = {
  comments: [],
  fetchLoading: false,
  fetchError: null,
};

export const commentsReducer = createReducer(
  initialState,
  on(fetchCommentsRequest, state => ({...state, fetchLoading: true})),
  on(fetchCommentsSuccess, (state, {comments}) => ({...state, fetchLoading: false, comments})),
  on(fetchCommentsFailure, (state, {error}) => ({...state, fetchLoading: false, fetchError: error}))
)
