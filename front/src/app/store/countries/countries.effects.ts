import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AppState } from '../types';
import { HelpersService } from '../../services/helpers.service';
import { fetchCountriesFailure, fetchCountriesRequest, fetchCountriesSuccess } from '../users/users.actions';
import { map, mergeMap } from 'rxjs';
import { CountriesService } from '../../services/countries.service';


@Injectable()
export class CountriesEffects {
  constructor(
    private actions: Actions,
    private store: Store<AppState>,
    private countriesService: CountriesService,
    private helpersService: HelpersService,
  ) {}

  fetchCountries = createEffect(() => this.actions.pipe(
    ofType(fetchCountriesRequest),
    mergeMap(() => this.countriesService.getCountries().pipe(
      map(countries => {
        console.log(countries);
        return fetchCountriesSuccess({countries})}),
      this.helpersService.catchServerError(fetchCountriesFailure),
    ))
  ));
}
