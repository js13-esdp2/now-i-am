import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { User } from '../../models/user.model';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/types';
import { NgForm } from '@angular/forms';
import { editUserRequest } from '../../store/users.actions';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.sass']
})
export class EditProfileComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('f') form!: NgForm;
  user: Observable<null | User>;
  isLoading: Observable<boolean>;


  isPhotoExists: boolean = false;
  private userData!: User;
  private userSub!: Subscription;


  constructor(
    private store: Store<AppState>,
  ) {
    this.user = store.select((state) => state.users.user);
    this.isLoading = store.select((state) => state.users.editLoading);
  }

  ngOnInit(): void {
    this.userSub = this.user.subscribe((user) => {
      if (user) {
        this.userData = user;
        this.isPhotoExists = !!user.photo;

      }
    });
  }

  ngAfterViewInit(){
    this.setFormValue({
      photo: this.userData.photo || '',
      displayName: this.userData.displayName,
      aboutMe: this.userData.aboutMe || '',
      age: this.userData.birthday || '',
      sex: this.userData.sex || '',
      country: this.userData.country || '',
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
      country: this.form.value.country,
      city: this.form.value.city,
      isPrivate: this.form.value.isPrivate
    };

    if(this.form.value.age){
      userData.birthday = this.form.value.age.toISOString();
    }

    this.store.dispatch(editUserRequest({userData}));
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }
}
