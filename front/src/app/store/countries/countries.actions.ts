import { createAction, props } from '@ngrx/store';
import { CountriesModel } from '../../models/countries.model';

export const fetchCountriesRequest = createAction('[Countries], Fetch Countries Request');
export const fetchCountriesSuccess = createAction('[Countries], Fetch Countries Success', props<{countries: CountriesModel[]}>());
export const fetchCountriesFailure = createAction('[Countries], Fetch Countries Failure', props<{error: string}>());

