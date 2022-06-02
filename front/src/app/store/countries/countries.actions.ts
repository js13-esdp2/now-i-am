import { createAction, props } from '@ngrx/store';
import { Countries } from '../../models/user.model';

export const fetchCountriesRequest = createAction('[Countries], Fetch Countries Request');
export const fetchCountriesSuccess = createAction('[Countries], Fetch Countries Success', props<{countries: Countries[]}>());
export const fetchCountriesFailure = createAction('[Countries], Fetch Countries Failure', props<{error: string}>());

