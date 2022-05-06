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
  fetchPostsSuccess,
  fetchTitlePostsFailure,
  fetchTitlePostsRequest,
  fetchTitlePostsSuccess,
  fetchUserPostFailure,
  fetchUserPostRequest,
  fetchUserPostSuccess,
  onPostModalDataChange,
  likePostFailure,
  likePostRequest,
  likePostSuccess,
  removePostRequest,
  removePostSuccess, fetchMyHistoryPostsRequest, fetchMyHistoryPostsSuccess, fetchMyHistoryPostsFailure
} from './posts.actions';

const initialState: PostState = {
  post: null,
  postModalData: {
    postId: '',
    searchTitle: '',
  },
  posts: [],
  fetchLoading: false,
  fetchError: null,
  createLoading: false,
  createError: null,
  likeLoading: false,
  likeError: null,
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

  on(likePostRequest, state => ({...state, likeLoading: true, likeError: null})),
  on(likePostSuccess, (state, { post }) => ({...state, likeLoading: false, post})),
  on(likePostFailure, (state, { error }) => ({...state, likeLoading: false, likeError: error})),

  on(removePostRequest, (state, {id}) => {
    const array = state.posts.filter( post=> {
      return post._id !== id
    })
    return ({...state, posts: array, fetchLoading: true})}),
  on(removePostSuccess, state => ({...state, fetchLoading: false})),

  on(fetchMyHistoryPostsRequest, state => ({...state, fetchLoading: true})),
  on(fetchMyHistoryPostsSuccess, (state, {posts}) => ({...state, fetchLoading: false, posts})),
  on(fetchMyHistoryPostsFailure, (state, {error}) => ({...state, fetchLoading: false, fetchError: error})),


  on(onPostModalDataChange, (state, {postModalData}) => ({...state, postModalData})),
);
