import { createAction, props } from '@ngrx/store';
import { CommentData } from '../../models/comment.model';
import { Comment } from '../../models/comment.model';

export const fetchCommentsRequest = createAction('[Comment] Fetch Request', props<{postId: string}>());
export const fetchCommentsSuccess = createAction('[Comment] Fetch Success', props<{comments: Comment[]}>());
export const fetchCommentsFailure = createAction('[Comment] Fetch Failure', props<{error: string}>());

export const createCommentRequest = createAction('[Comment] Create Request', props<{comment: CommentData}>());
export const createCommentSuccess = createAction('[Comment] Create Success', props<{comments: Comment[]}>());
export const createCommentFailure = createAction('[Comment] Create Failure', props<{error: string}>());

export const removeCommentRequest = createAction('[Comment] Remove Request', props<{commentId: string}>());
export const removeCommentSuccess = createAction('[Comment] Remove Success');
export const removeCommentFailure = createAction('[Comment] Remove Failure', props<{error: string}>());
