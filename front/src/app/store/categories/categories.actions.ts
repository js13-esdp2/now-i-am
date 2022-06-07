import { createAction, props } from '@ngrx/store';
import { Category } from '../../models/category.model';

export const fetchCategoriesRequest = createAction('[Categories] Fetch Request', props<{ title: string }>());
export const fetchCategoriesSuccess = createAction('[Categories] Fetch Success', props<{ categories: Category[] }>());
export const fetchCategoriesFailure = createAction('[Categories] Fetch Failure', props<{ error: string }>());
