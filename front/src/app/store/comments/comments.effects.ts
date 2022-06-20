import { Injectable } from '@angular/core';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { PostsService } from '../../services/posts.service';
import { HelpersService } from '../../services/helpers.service';
import { catchError, map, mergeMap, of, tap } from 'rxjs';
import {
  createCommentFailure,
  createCommentRequest, createCommentSuccess,
  fetchCommentsFailure,
  fetchCommentsRequest,
  fetchCommentsSuccess, removeCommentRequest, removeCommentSuccess
} from './comments.actions';


@Injectable()
export class CommentsEffects {

  constructor(
    private actions: Actions,
    private postsService: PostsService,
    private helpers: HelpersService,
  ) {}

  fetchComments = createEffect(() => this.actions.pipe(
    ofType(fetchCommentsRequest),
    mergeMap(({postId}) => this.postsService.getComments(postId).pipe(
      map(comments => fetchCommentsSuccess({comments})),
      catchError(() => of(fetchCommentsFailure({
        error: 'Что-то пошло не так'
      })))
    ))
  ));

  createComment = createEffect(() => this.actions.pipe(
    ofType(createCommentRequest),
    mergeMap(({comment}) => this.postsService.createComment(comment).pipe(
      map(comments => createCommentSuccess({comments})),
      tap(() => {
        this.helpers.openSnackBar('Комментарий добавлен');
      }),
      catchError(() => of(createCommentFailure({error: ''})))
    ))
  ));

  removeComment = createEffect(() => this.actions.pipe(
    ofType(removeCommentRequest),
    mergeMap(({commentId}) => this.postsService.removeComment(commentId).pipe(
      map(() => removeCommentSuccess()),
      tap(() => {
        this.helpers.openSnackBar('Комментарий был удален!');
      })
    ))
  ));

}

