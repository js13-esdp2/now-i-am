import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { fetchCategoriesFailure, fetchCategoriesRequest, fetchCategoriesSuccess } from './categories.actions';
import { map, mergeMap } from 'rxjs';
import { CategoriesService } from '../../services/categories.service';
import { HelpersService } from '../../services/helpers.service';

@Injectable()
export class CategoriesEffects {

  constructor(
    private actions: Actions,
    private helpers: HelpersService,
    private categoriesService: CategoriesService,
  ) {}

  fetchCategories = createEffect(() => this.actions.pipe(
    ofType(fetchCategoriesRequest),
    mergeMap(({ title }) => this.categoriesService.fetchCategories(title).pipe(
      map((categories) => fetchCategoriesSuccess({ categories })),
      this.helpers.catchServerError(fetchCategoriesFailure),
    )),
  ));
}
