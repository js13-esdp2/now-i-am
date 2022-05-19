import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, startWith, Subscription } from 'rxjs';
import { ApiCountryData, User } from '../../models/user.model';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/types';
import { FormControl, NgForm } from '@angular/forms';
import { editUserRequest, fetchCountriesRequest } from '../../store/users/users.actions';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.sass']
})
export class EditProfileComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('f') form!: NgForm;
  user: Observable<null | User>;
  country: Observable<ApiCountryData[]>;
  isLoading: Observable<boolean>;
  countrySub!: Subscription;

  isPhotoExists: boolean = false;
  private userData!: User;
  private userSub!: Subscription;

  countryData: ApiCountryData [] | null = null;

  myControl = new FormControl();
  options!: ApiCountryData[];
  filteredOptions!: Observable<ApiCountryData[]>;

  constructor(
    private store: Store<AppState>,
  ) {
    this.user = store.select((state) => state.users.user);
    this.country = store.select((state) => state.users.country);
    this.isLoading = store.select((state) => state.users.editLoading);
  }

  ngOnInit(): void {
    this.userSub = this.user.subscribe((user) => {
      if (user) {
        this.userData = user;
        this.isPhotoExists = !!user.photo;}
    });
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

  ngAfterViewInit() {
    this.setFormValue({
      photo: this.userData.photo || '',
      displayName: this.userData.displayName,
      aboutMe: this.userData.aboutMe || '',
      age: this.userData.birthday || '',
      sex: this.userData.sex || '',
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
      city: this.form.value.city,
      isPrivate: this.form.value.isPrivate
    };

    if (this.form.value.age) {
      userData.birthday = this.form.value.age.toISOString();
    }

    this.store.dispatch(editUserRequest({userData}));
  }

  displayFn(data: ApiCountryData): string {
    return data && data.city ? data.city : '';
  }

  private _filter(city: string): ApiCountryData[] {
    const filterValue = city.toLowerCase();
    return this.options.filter(option => option.city.toLowerCase().includes(filterValue));
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
    this.countrySub.unsubscribe();
  }
}
