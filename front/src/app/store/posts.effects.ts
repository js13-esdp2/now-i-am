import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, tap } from 'rxjs';
import { Router } from '@angular/router';
import { HelpersService } from '../services/helpers.service';
import { PostsService } from '../services/posts.service';
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
  likePostFailure,
  likePostRequest,
  likePostSuccess,
  removePostRequest,
  removePostSuccess
} from './posts.actions';

@Injectable()
export class PostsEffects {
  constructor(
    private actions: Actions,
    private postsService: PostsService,
    private router: Router,
    private helpers: HelpersService,
  ) {}

  fetchPosts = createEffect(() => this.actions.pipe(
    ofType(fetchPostsRequest),
    mergeMap(() => this.postsService.getPosts('').pipe(
      map(posts => fetchPostsSuccess({posts})),
      catchError(() => of(fetchPostsFailure({
        error: 'Что-то пошло не так'
      })))
    ))
  ));

  fetchTitlePosts = createEffect(() => this.actions.pipe(
    ofType(fetchTitlePostsRequest),
    mergeMap(({ title }) => this.postsService.getPosts('', title).pipe(
      map(posts => fetchTitlePostsSuccess({posts})),
      catchError(() => of(fetchTitlePostsFailure({
        error: 'Что-то пошло не так'
      })))
    ))
  ));

  fetchPostOfOne= createEffect(() => this.actions.pipe(
    ofType(fetchOneOfPostRequest),
    mergeMap(({id}) => this.postsService.getPost(id).pipe(
      map(post => fetchOneOfPostSuccess({post})),
      catchError(() => of(fetchOneOfPostFailure({
        error: 'Что-то пошло не так'
      })))
    ))
  ));

  fetchUserPosts = createEffect(() => this.actions.pipe(
    ofType(fetchUserPostRequest),
    mergeMap(({id}) => this.postsService.getPosts(id).pipe(
      map(posts => fetchUserPostSuccess({posts})),
      catchError(() => of(fetchUserPostFailure({
        error: 'Что-то пошло не так'
      })))
    ))
  ));

  createPost = createEffect(() => this.actions.pipe(
    ofType(createPostRequest),
    mergeMap(({postData}) => this.postsService.createPost(postData).pipe(
      map(() => createPostSuccess()),
      tap(() => {
        this.helpers.openSnackBar('Успешно создан пост')
        void this.router.navigate(['/statistic'], { queryParams: { title: postData.title }})
      }),
      catchError(() => of(createPostFailure({error: 'Неверные данные'})))
    ))
  ));

  likePost = createEffect(() => this.actions.pipe(
    ofType(likePostRequest),
    mergeMap(({ id }) => this.postsService.likePost(id).pipe(
      map((post) => likePostSuccess({post})),
      this.helpers.catchServerError(likePostFailure),
    )),
  ));

  removePost= createEffect(() => this.actions.pipe(
    ofType(removePostRequest),
    mergeMap(({id}) => this.postsService.removePost(id).pipe(
      map(posts => removePostSuccess({posts})),
      tap(() => {
        this.helpers.openSnackBar('Задание было удалено!');
      })
    ))
  ));
}
