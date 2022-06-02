import { CountriesState } from '../types';
import { createReducer, on } from '@ngrx/store';
import { fetchCountriesFailure, fetchCountriesRequest, fetchCountriesSuccess } from './countries.actions';


const initialState: CountriesState = {
  countries: [],
  fetchError: null,
};

export const CountriesReducer = createReducer(
  initialState,
  on(fetchCountriesRequest, state => ({...state})),
  on(fetchCountriesSuccess, (state, {countries}) => ({...state, countries: countries})),
  on(fetchCountriesFailure, (state, {error}) => ({...state, fetchError: error})),
);
