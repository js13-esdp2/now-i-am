import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { map, Observable, startWith, Subscription } from 'rxjs';
import { User } from '../../models/user.model';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/types';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { editUserRequest } from '../../store/users/users.actions';
import { City, CountriesApi } from '../../models/countries.model';
import { fetchCountriesRequest } from '../../store/countries/countries.actions';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.sass']
})
export class EditProfileComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('f') form!: NgForm;
  user: Observable<null | User>;
  country: Observable<CountriesApi[]>;
  cities!: City[];
  isLoading: Observable<boolean>;
  countrySub!: Subscription;

  isPhotoExists: boolean = false;
  isSearched = true;
  private userData!: User;
  private userSub!: Subscription;

  myControl = new FormControl();
  options!: CountriesApi[];
  filteredOptions!: Observable<CountriesApi[]>;

  constructor(
    private store: Store<AppState>,
  ) {
    this.user = store.select((state) => state.users.user);
    this.country = store.select((state) => state.countries.countries);
    this.isLoading = store.select((state) => state.users.editLoading);
  }

  ngOnInit(): void {
    this.store.dispatch(fetchCountriesRequest());

    this.userSub = this.user.subscribe((user) => {
      if (user) {
        this.userData = user;
        this.isPhotoExists = !!user.photo;
      }
    });

    this.countrySub = this.country.subscribe(countryInfo => {
      this.options = countryInfo;
    });

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : 'Россия')),
      map(country => (country ? this._filter(country) : this.options.slice())),
    );
  }

  ngAfterViewInit() {
    this.setFormValue({
      photo: this.userData.photo || '',
      displayName: this.userData.displayName,
      aboutMe: this.userData.aboutMe || '',
      age: this.userData.birthday || '',
      sex: this.userData.sex || '',
      city: this.userData.city || '',
      isPrivate: this.userData.isPrivate || false
    });
  }

  setFormValue(value: { [key: string]: any }) {
    setTimeout(() => {
      this.form.form.setValue(value);
    }, 0);
  }

  onRemovePhoto() {
    this.isPhotoExists = false;
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }
    const userData = {
      photo: this.form.value.photo,
      displayName: this.form.value.displayName,
      aboutMe: this.form.value.aboutMe,
      birthday: '',
      sex: this.form.value.sex,
      country: this.myControl.value.country,
      city: this.form.value.city,
      isPrivate: this.form.value.isPrivate
    };

    if (this.form.value.age) {
      userData.birthday = this.form.value.age.toISOString();
    }
    this.store.dispatch(editUserRequest({userData}));
  }

  displayFn(data: CountriesApi): string {
    return data && data.country ? data.country : '';
  }

  private _filter(country: string): CountriesApi[] {
    const filterValue = country.toLowerCase();
    return this.options.filter(option => option.country.toLowerCase().includes(filterValue));
  }

  getCities(cities: City[]) {
    this.cities = cities;
    this.isSearched = false;
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
    this.countrySub.unsubscribe();
  }
}
