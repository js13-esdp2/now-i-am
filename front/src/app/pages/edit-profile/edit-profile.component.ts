import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { map, Observable, Subscription } from 'rxjs';
import { EditUserData, User } from '../../models/user.model';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/types';
import { NgForm } from '@angular/forms';
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

  isPhotoExists = false;

  private userData!: User;
  private user: Observable<null | User>;
  isLoading: Observable<boolean>;

  cities: City[] = [];
  filteredCountries?: Observable<CountriesApi[]>;
  private countriesData: CountriesApi[] = [];
  private countries: Observable<CountriesApi[]>;

  private userSub!: Subscription;
  private countriesSub!: Subscription;

  constructor(
    private store: Store<AppState>,
  ) {
    this.user = store.select((state) => state.users.user);
    this.isLoading = store.select((state) => state.users.editLoading);
    this.countries = store.select((state) => state.countries.countries);
  }

  ngOnInit(): void {
    this.userSub = this.user.subscribe((user) => {
      if (user) {
        this.userData = user;
        this.isPhotoExists = !!user.photo;
      }
    });

    this.countriesSub = this.countries.subscribe((countries) => {
      if (!countries.length) {
        return;
      }

      this.countriesData = countries;
      this.updateFormData();
    });

    this.store.dispatch(fetchCountriesRequest());
  }

  ngAfterViewInit(): void {
    this.updateFormData();
    this.getCountries();
  }

  setFormValue(value: { [key: string]: any }): void {
    setTimeout(() => {
      this.form.form.setValue(value);
    }, 0);
  }

  updateFormData(): void {
    this.setFormValue({
      photo: this.userData.photo || '',
      displayName: this.userData.displayName,
      aboutMe: this.userData.aboutMe || '',
      age: this.userData.birthday || '',
      sex: this.userData.sex || '',
      country: this.countriesData.length && this.userData.country ? this.userData.country : '',
      city: this.countriesData.length && this.userData.city  ? this.userData.city : '',
      isPrivate: this.userData.isPrivate || false
    });
  }

  getCountries(): void {
    setTimeout(() => {
      this.filteredCountries = this.form.form.get('country')?.valueChanges.pipe(
        map((country: string) => {
          if (!country) {
            return this.countriesData.slice();
          }

          const countryLow = country.toLowerCase();
          return this.countriesData.filter((country) => country.country.toLowerCase().includes(countryLow));
        }),
      );
    }, 0);
  }

  getCities(countryName: string): void {
    this.form.form.get('city')?.setValue('');

    const countryData = this.countriesData.find((c) => c.country === countryName);
    this.cities = countryData ? countryData.cities : [];
  }

  onRemovePhoto(): void {
    this.isPhotoExists = false;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    const userData: EditUserData = {
      photo: this.form.value.photo,
      displayName: this.form.value.displayName,
      aboutMe: this.form.value.aboutMe,
      birthday: '',
      sex: this.form.value.sex,
      country: this.form.value.country || '',
      city: this.form.value.city || '',
      isPrivate: this.form.value.isPrivate,
    };

    const age = this.form.value.age;
    if (age && age instanceof Date) {
      userData.birthday = this.form.value.age.toISOString();
    }

    this.store.dispatch(editUserRequest({ userData }));
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
    this.countriesSub.unsubscribe();
  }
}
