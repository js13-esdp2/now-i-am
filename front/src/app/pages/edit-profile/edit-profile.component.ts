import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
export class EditProfileComponent implements OnInit, OnDestroy {
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

        this.setFormValue({
          photo: user.photo || '',
          displayName: user.displayName,
          aboutMe: user.aboutMe || '',
          age: user.age || '',
          sex: user.sex || '',
          country: user.country || '',
          city: user.city || '',
          isPrivate: user.isPrivate || false
        });
      }
    });
  }

  setFormValue(value: {[key: string]: any}) {
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

    const userData = this.form.value;
    if (userData.age === null) {
      delete userData.age;
    }

    this.store.dispatch(editUserRequest({ userData }));
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

}
