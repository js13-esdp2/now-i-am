import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { Observable, startWith, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/types';
import { ApiCountryData } from '../../models/user.model';
import { fetchCountriesRequest } from '../../store/users/users.actions';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.sass']
})
export class SearchComponent implements OnInit, OnDestroy {
  @ViewChild('f') form!: NgForm;
  country: Observable<ApiCountryData[]>;
  countrySub!: Subscription;

  isLoading: Observable<boolean>;
  error: Observable<null | string>;

  myControl = new FormControl();
  options!: ApiCountryData[];
  filteredOptions!: Observable<ApiCountryData[]>;

  isSearched = false;
  panelOpenState = false;

  constructor(
    private store: Store<AppState>,
    private router: Router,
  ) {
    this.country = store.select((state) => state.users.country);
    this.isLoading = store.select(state => state.posts.fetchLoading);
    this.error = store.select(state => state.posts.fetchError);
  }

  ngOnInit() {
    this.countrySub = this.country.subscribe(countryInfo => {
      this.options = countryInfo;
    });
    this.store.dispatch(fetchCountriesRequest());

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value.city)),
      map(city => (city ? this._filter(city) : this.options.slice())),
    );
  }

  onSubmit(): void {
    this.isSearched = true;
    const filterData = this.form.value;
    const query = {queryParams: {title: filterData.title, birthday: filterData.birthday,
        sex: filterData.sex, city: this.myControl.value.city, isPrivate: filterData.isPrivate}};
    void this.router.navigate([`/statistic`], query);
  }

  displayFn(data: ApiCountryData): string {
    return data && data.city ? data.city : '';
  }

  private _filter(city: string): ApiCountryData[] {
    const filterValue = city.toLowerCase();
    return this.options.filter(option => option.city.toLowerCase().includes(filterValue));
  }

  ngOnDestroy(): void {
    this.countrySub.unsubscribe();
  }
}
