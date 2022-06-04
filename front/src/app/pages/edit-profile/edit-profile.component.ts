import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { User } from '../../models/user.model';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/types';
import { FormControl, NgForm } from '@angular/forms';
import { editUserRequest } from '../../store/users/users.actions';
import { CountriesModel } from '../../models/countries.model';
import { fetchCountriesRequest } from '../../store/countries/countries.actions';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.sass']
})
export class EditProfileComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('f') form!: NgForm;
  user: Observable<null | User>;
  country: Observable<CountriesModel[]>;
  isLoading: Observable<boolean>;
  countrySub!: Subscription;
  cityData!: string;

  isPhotoExists: boolean = false;
  private userData!: User;
  private userSub!: Subscription;

  countryData: CountriesModel[] | null = null;

  myControl = new FormControl();
  options!: CountriesModel[];
  filteredOptions!: Observable<CountriesModel[]>;

  constructor(
    private store: Store<AppState>,
  ) {
    this.user = store.select((state) => state.users.user);
    this.country = store.select((state) => state.countries.countries);
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

    // this.filteredOptions = this.myControl.valueChanges.pipe(
    //   startWith(''),
    //   map(value => (typeof value === 'string' ? value : value.city)),
    //   map(city => (city ? this._filter(city) : this.options.slice())),
    // );
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
    let countryData = '';

    if (this.form.invalid) {
      return;
    }

    // this.options.forEach(data  => {
    //   if(data.city === this.cityData){
    //     countryData = data.country;
    //   }
    // })

    const userData = {
      photo: this.form.value.photo,
      displayName: this.form.value.displayName,
      aboutMe: this.form.value.aboutMe,
      birthday: '',
      sex: this.form.value.sex,
      country: countryData,
      city: this.cityData,
      isPrivate: this.form.value.isPrivate
    };

    if (this.form.value.age) {
      userData.birthday = this.form.value.age.toISOString();
    }
    this.store.dispatch(editUserRequest({userData}));
  }

  // displayFn(data: ApiCountryData): string {
  //   return data && data.city ? data.city : '';
  // }

  // private _filter(city: string): CountriesModel[] {
  //   const filterValue = city.toLowerCase();
  //   this.cityData = city;
  //   // return this.options.filter(option => option.city.toLowerCase().includes(filterValue));
  // }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
    this.countrySub.unsubscribe();
  }
}
