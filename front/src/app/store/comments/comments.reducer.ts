import { createReducer, on } from '@ngrx/store';
import { CommentsState } from '../types';
import {
  fetchCommentsFailure,
  fetchCommentsRequest,
  fetchCommentsSuccess,
  removeCommentRequest, removeCommentSuccess
} from './comments.actions';

const initialState: CommentsState = {
  comments: [],
  fetchLoading: false,
  fetchError: null,
};

export const commentsReducer = createReducer(
  initialState,
  on(fetchCommentsRequest, state => ({...state, fetchLoading: true})),
  on(fetchCommentsSuccess, (state, {comments}) => ({...state, fetchLoading: false, comments})),
  on(fetchCommentsFailure, (state, {error}) => ({...state, fetchLoading: false, fetchError: error})),

  on(removeCommentRequest, (state, {commentId}) => {
    const array = state.comments!.filter(comment => {
      return comment._id !== commentId
    })
    return ({...state, comments: array, fetchLoading: true})
  }),
  on(removeCommentSuccess, state => ({...state, fetchLoading: false})),
)
