import { createReducer, on } from '@ngrx/store';
import { CategoriesState } from '../types';
import { fetchCategoriesFailure, fetchCategoriesRequest, fetchCategoriesSuccess } from './categories.actions';

const initialState: CategoriesState = {
  categories: [],
  fetchLoading: false,
  fetchError: null
};

export const categoriesReducer = createReducer(
  initialState,
  on(fetchCategoriesRequest, state => ({ ...state, categories: [], fetchLoading: true, fetchError: null })),
  on(fetchCategoriesSuccess, (state, { categories }) => ({ ...state, categories, fetchLoading: false })),
  on(fetchCategoriesFailure, (state, { error }) => ({ ...state, fetchLoading: false, fetchError: error })),
);
