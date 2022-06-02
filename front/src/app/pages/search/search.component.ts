import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { Observable, startWith, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/types';
import { ApiCountryData } from '../../models/user.model';
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
  arrayCities!: string;

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
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value.country)),
      map(country => (this.country ? this._filter(country) : this.options.slice())),
    );
  }

  onSubmit(): void {
    this.isSearched = true;
    const filterData = this.form.value;
    const isPrivate = this.form.value.isPrivate === '' ? '' : false;
    const query = {queryParams: {title: filterData.title, birthday: filterData.birthday,
        sex: filterData.sex, city: this.myControl.value.city, isPrivate: isPrivate}};
    void this.router.navigate([`/statistic`], query);
  }

  displayFn(data: ApiCountryData): string {
    return data && data.country ? data.country : '';
  }

  private _filter(country: string): ApiCountryData[] {
    const filterValue = country.toLowerCase();
    console.log(country);
    return this.options.filter(option => option.country.toLowerCase().includes(filterValue));
  }

  ngOnDestroy(): void {
    this.countrySub.unsubscribe();
  }
}
