import { createReducer, on } from '@ngrx/store';
import { PostState } from './types';
import {
  createPostFailure,
  createPostRequest,
  createPostSuccess,
  fetchOneOfPostFailure,
  fetchOneOfPostRequest,
  fetchOneOfPostSuccess,
  fetchPostsFailure,
  fetchPostsRequest,
  fetchPostsSuccess, fetchTitlePostsFailure, fetchTitlePostsRequest, fetchTitlePostsSuccess,
  fetchUserPostFailure,
  fetchUserPostRequest,
  fetchUserPostSuccess,
  removePostRequest,
  removePostSuccess
} from './posts.actions';

const initialState: PostState = {
  post: null,
  posts: [],
  fetchLoading: false,
  fetchError: null,
  createLoading: false,
  createError: null,
};
export const postsReducer = createReducer(
  initialState,
  on(fetchPostsRequest, state => ({...state, fetchLoading: true})),
  on(fetchPostsSuccess, (state, {posts}) => ({...state, fetchLoading: false, posts})),
  on(fetchPostsFailure, (state, {error}) => ({...state, fetchLoading: false, fetchError: error})),

  on(fetchTitlePostsRequest, state => ({...state, fetchLoading: true})),
  on(fetchTitlePostsSuccess, (state, {posts}) => ({...state, fetchLoading: false, posts})),
  on(fetchTitlePostsFailure, (state, {error}) => ({...state, fetchLoading: false, fetchError: error})),

  on(fetchOneOfPostRequest, state => ({...state, fetchLoading: true})),
  on(fetchOneOfPostSuccess, (state, {post}) => ({...state, fetchLoading: false, post})),
  on(fetchOneOfPostFailure, (state, {error}) => ({...state, fetchLoading: false, fetchError: error})),

  on(fetchUserPostRequest, state => ({...state, fetchLoading: true})),
  on(fetchUserPostSuccess, (state, {posts}) => ({...state, fetchLoading: false, posts})),
  on(fetchUserPostFailure, (state, {error}) => ({...state, fetchLoading: false, fetchError: error})),

  on(createPostRequest, state => ({...state, createLoading: true})),
  on(createPostSuccess, state => ({...state, createLoading: false})),
  on(createPostFailure, (state, {error}) => ({...state, createLoading: false, createError: error,})),

  on(removePostRequest, state => ({...state, fetchLoading: true})),
  on(removePostSuccess, (state, {posts}) => ({...state, fetchLoading: false, posts})),
);
