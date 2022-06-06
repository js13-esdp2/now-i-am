import { Component, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/types';
import { Observable } from 'rxjs';
import { Category } from '../../models/category.model';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { fetchCategoriesRequest } from '../../store/categories/categories.actions';

@Component({
  selector: 'app-autocomplete-categories',
  exportAs: 'appAutocompleteCategories',
  templateUrl: './autocomplete-categories.component.html',
  styleUrls: ['./autocomplete-categories.component.sass']
})
export class AutocompleteCategoriesComponent {
  categories: Observable<Category[]>;
  isTextInput = false;

  @ViewChild(MatAutocomplete) autocomplete!: MatAutocomplete;

  constructor(
    private store: Store<AppState>,
  ) {
    this.categories = store.select((state) => state.categories.categories);
  }

  getCategories(fieldValue: string): void {
    this.store.dispatch(fetchCategoriesRequest({title: fieldValue}));
    this.isTextInput = true;
  }

}
