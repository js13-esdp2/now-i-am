import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { Observable, startWith, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/types';
import { ApiCountryData, User } from '../../models/user.model';
import { checkIsOnlineRequest, fetchCountriesRequest } from '../../store/users/users.actions';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Post } from '../../models/post.model';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.sass']
})
export class SearchComponent implements OnInit, OnDestroy {
  @ViewChild('f') form!: NgForm;
  country: Observable<ApiCountryData[]>;
  countrySub!: Subscription;
  userSub!: Subscription;
  isCheckSub!: Subscription;

  isLoading: Observable<boolean>;
  error: Observable<null | string>;
  isCheck: Observable<null | Post[]>;
  user: Observable<null | User>;

  myControl = new FormControl();
  options!: ApiCountryData[];
  filteredOptions!: Observable<ApiCountryData[]>;

  isSearched = false;
  panelOpenState = false;
  check = true;


  constructor(
    private store: Store<AppState>,
    private router: Router,
  ) {
    this.user = store.select(state => state.users.user);
    this.country = store.select((state) => state.users.country);
    this.isLoading = store.select(state => state.posts.fetchLoading);
    this.error = store.select(state => state.posts.fetchError);
    this.isCheck = store.select(state => state.users.posts);
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
