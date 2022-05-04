import { createAction, props } from '@ngrx/store';
import { Post, PostData, PostModalData } from '../models/post.model';

export const fetchPostsRequest = createAction('[Posts] Fetch Request');
export const fetchPostsSuccess = createAction('[Posts] Fetch Success', props<{posts: Post[]}>());
export const fetchPostsFailure = createAction('[Posts] Fetch Failure', props<{error: string}>());

export const fetchTitlePostsRequest = createAction('[Posts] Fetch Title Request', props<{title: string}>());
export const fetchTitlePostsSuccess = createAction('[Posts] Fetch Title Success', props<{posts: Post[]}>());
export const fetchTitlePostsFailure = createAction('[Posts] Fetch Title Failure', props<{error: string}>());

export const fetchOneOfPostRequest = createAction('[Posts] FetchIng Request', props<{id: string}>());
export const fetchOneOfPostSuccess = createAction('[Posts] FetchIng Success', props<{post: Post}>());
export const fetchOneOfPostFailure = createAction('[Posts] FetchIng Failure', props<{error: string}>());

export const fetchUserPostRequest = createAction('[Posts] Fetch User Request', props<{id: string}>());
export const fetchUserPostSuccess = createAction('[Posts] Fetch User Success', props<{posts: Post[]}>());
export const fetchUserPostFailure = createAction('[Posts] Fetch User Failure', props<{error: string}>());

export const createPostRequest = createAction('[Posts] Create Request', props<{postData: PostData}>());
export const createPostSuccess = createAction('[Posts] Create Success');
export const createPostFailure = createAction('[Posts] Create Failure', props<{error: string}>());

export const likePostRequest = createAction('[Posts] Like Request', props<{ id: string }>());
export const likePostSuccess = createAction('[Posts] Like Success', props<{ post: Post }>());
export const likePostFailure = createAction('[Posts] Like Failure', props<{ error: string }>());

export const removePostRequest = createAction('[Posts] Remove Request', props<{id: string}>());
export const removePostSuccess = createAction('[Posts] Remove Success', props<{posts: Post[]}>());

export const fetchMyHistoryPostsRequest = createAction('[MyHistoryPosts] Fetch Request', props<{user_id: string}>());
export const fetchMyHistoryPostsSuccess = createAction('[MyHistoryPosts] Fetch Success', props<{posts: Post[]}>());
export const fetchMyHistoryPostsFailure = createAction('[MyHistoryPosts] Fetch Failure', props<{error: string}>());


export const onPostModalDataChange = createAction('[Posts] Change Post Modal Data', props<{postModalData: PostModalData}>());
