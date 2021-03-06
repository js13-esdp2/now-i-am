import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, Observable, of, tap } from 'rxjs';
import { HelpersService } from '../../services/helpers.service';
import { PostsService } from '../../services/posts.service';
import {
  createPostFailure,
  createPostRequest,
  createPostSuccess,
  fetchMyHistoryPostsFailure,
  fetchMyHistoryPostsRequest,
  fetchMyHistoryPostsSuccess,
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
import { User } from '../../models/user.model';
import { AppState } from '../types';
import { Store } from '@ngrx/store';
import { FilterData } from '../../models/post.model';
import { Router } from '@angular/router';

@Injectable()
export class PostsEffects {

  user!: Observable<null | User>

  constructor(
    private actions: Actions,
    private postsService: PostsService,
    private helpers: HelpersService,
    private store: Store<AppState>,
    private router: Router,
  ) {
  }

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
    mergeMap(({filterData}) => this.postsService.getPosts(filterData).pipe(
      map(posts => fetchTitlePostsSuccess({posts})),
      catchError(() => of(fetchTitlePostsFailure({
        error: 'Что-то пошло не так'
      })))
    ))
  ));

  fetchPostOfOne = createEffect(() => this.actions.pipe(
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
        const filterData: FilterData = {
          title: postData.title,
          birthday: '',
          country: '',
          city: '',
          sex: '',
          isPrivate: '',
        }
        const query = {queryParams: {title: filterData.title, birthday: filterData.birthday,
            sex: filterData.sex, country: filterData.country,  city: filterData.city,  isPrivate: filterData.isPrivate}};
        void this.router.navigate([`/statistic`], query);
        this.helpers.openSnackBar('Успешно создан пост');
      }),
      catchError(() => of(createPostFailure({error: 'Неверные данные'})))
    ))
  ));

  likePost = createEffect(() => this.actions.pipe(
    ofType(likePostRequest),
    mergeMap(({id}) => this.postsService.likePost(id).pipe(
      map((post) => likePostSuccess({post})),
      tap(({post}) => {
        this.store.dispatch(fetchOneOfPostRequest({id: post._id}));
      }),
      this.helpers.catchServerError(likePostFailure),
    )),
  ));

  removePost = createEffect(() => this.actions.pipe(
    ofType(removePostRequest),
    mergeMap(({id}) => this.postsService.removePost(id).pipe(
      map(() => removePostSuccess()),
      tap(() => {
        this.helpers.openSnackBar('Задание было удалено!');
      })
    ))
  ));

  fetchMyHistoryPosts = createEffect(() => this.actions.pipe(
    ofType(fetchMyHistoryPostsRequest),
    mergeMap(({user_id}) => this.postsService.getMyHistoryPosts(user_id).pipe(
      map(posts => fetchMyHistoryPostsSuccess({posts})),
      catchError(() => of(fetchMyHistoryPostsFailure({
        error: 'Что-то пошло не так'
      })))
    ))
  ));


}
