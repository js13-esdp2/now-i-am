import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AppState } from './types';
import { HelpersService } from '../services/helpers.service';
import { map, mergeMap, } from 'rxjs';
import { searchUsersFailure, searchUsersRequest, searchUsersSuccess } from './search.actions';
import { SearchService } from '../services/search.service';

@Injectable()
export class SearchEffects {

  constructor(
    private actions: Actions,
    private store: Store<AppState>,
    private searchService: SearchService,
    private helpersService: HelpersService,
  ) {}

  searchUsers = createEffect(() => this.actions.pipe(
    ofType(searchUsersRequest),
    mergeMap(({searchData}) => this.searchService.searchUsers(searchData).pipe(
      map((users) => searchUsersSuccess({users})),
      this.helpersService.catchServerError(searchUsersFailure)
    )),
  ));
}
