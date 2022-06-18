import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { Observable, startWith, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/types';
import { User } from '../../models/user.model';
import { checkIsOnlineRequest } from '../../store/users/users.actions';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { City, CountriesApi, CountriesModel } from '../../models/countries.model';
import { Post } from '../../models/post.model';
import { fetchCountriesRequest } from '../../store/countries/countries.actions';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.sass']
})
export class SearchComponent implements OnInit, OnDestroy {
  @ViewChild('f') form!: NgForm;
  countries: Observable<CountriesApi[]>;
  cities!: City[];
  countrySub!: Subscription;
  userSub!: Subscription;
  isCheckSub!: Subscription;

  isLoading: Observable<boolean>;
  error: Observable<null | string>;
  isCheck: Observable<null | Post[]>;
  user: Observable<null | User>;

  myControl = new FormControl();
  options!: CountriesApi[];
  filteredOptions!: Observable<CountriesApi[]>;

  isSearched = true;
  panelOpenState = false;
  check = true;


  constructor(
    private store: Store<AppState>,
    private router: Router,
  ) {
    this.user = store.select(state => state.users.user);
    this.countries = store.select((state) => state.countries.countries);
    this.isLoading = store.select(state => state.posts.fetchLoading);
    this.error = store.select(state => state.posts.fetchError);
    this.isCheck = store.select(state => state.users.posts);
  }

  ngOnInit() {
    this.store.dispatch(fetchCountriesRequest());
    this.countrySub = this.countries.subscribe(countryInfo => {
      this.options = countryInfo;
    });
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value.country)),
      map(country => (this.countries ? this._filter(country) : this.options.slice())),
    );
  }

  onSubmit(): void {
    const filterData = this.form.value;
    const isPrivate = this.form.value.isPrivate === '' ? '' : false;
    const query = {
      queryParams: {
        title: filterData.title, birthday: filterData.birthday,
        sex: filterData.sex, country: this.myControl.value.country, city: filterData.city, isPrivate: isPrivate
      }
    };
    void this.router.navigate([`/statistic`], query);
  }

  displayFn(data: CountriesApi): string {
    return data && data.country ? data.country : '';
  }

  getCities(cities: City[]) {
    this.cities = cities;
    this.isSearched = false;
  }

  private _filter(country: string): CountriesApi[] {
    const filterValue = country.toLowerCase();
    return this.options.filter(option => option.country.toLowerCase().includes(filterValue));
  }

  checkUser() {
    this.userSub = this.user.subscribe(userData => {
      if (userData) {
        this.store.dispatch(checkIsOnlineRequest({userId: userData._id}));
      }
    })
    this.isCheckSub = this.isCheck.subscribe(data => {
      if (data){
        if (data.length > 0){
          this.check = false;
        }
      } else {
        this.check = true;
      }
    });
  }

  ngOnDestroy(): void {
    this.countrySub.unsubscribe();
    this.userSub.unsubscribe();
    this.isCheckSub.unsubscribe();
  }
}
