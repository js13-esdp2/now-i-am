import { createAction, props } from '@ngrx/store';
import { CommentData, Post, PostData, PostModalData, RemoveCommentData } from '../../models/post.model';

export const fetchPostsRequest = createAction('[Posts] Fetch Request');
export const fetchPostsSuccess = createAction('[Posts] Fetch Success', props<{posts: Post[]}>());
export const fetchPostsFailure = createAction('[Posts] Fetch Failure', props<{error: string}>());

export const fetchTitlePostsRequest = createAction('[Posts] Fetch Title Request', props<{filterData: any}>());
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

export const removePostRequest = createAction('[Post] Remove Request', props<{id: string}>());
export const removePostSuccess = createAction('[Post] Remove Success');

export const fetchMyHistoryPostsRequest = createAction('[MyHistoryPosts] Fetch Request', props<{user_id: string}>());
export const fetchMyHistoryPostsSuccess = createAction('[MyHistoryPosts] Fetch Success', props<{posts: Post[]}>());
export const fetchMyHistoryPostsFailure = createAction('[MyHistoryPosts] Fetch Failure', props<{error: string}>());

export const createPostCommentRequest = createAction('[Comment] Create Request', props<{comment: CommentData}>());
export const createPostCommentSuccess = createAction('[Comment] Create Success');
export const createPostCommentFailure = createAction('[Comment] Create Failure', props<{error: string}>());

export const removePostCommentRequest = createAction('[Comment] Remove Request', props<{comment: RemoveCommentData}>());
export const removePostCommentSuccess = createAction('[Comment] Remove Success');
export const removePostCommentFailure = createAction('[Comment] Remove Failure', props<{error: string}>());

export const onPostModalDataChange = createAction('[Posts] Change Post Modal Data', props<{postModalData: PostModalData}>());
