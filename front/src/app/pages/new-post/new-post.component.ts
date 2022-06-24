import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/types';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { FilterData, Post, PostData } from '../../models/post.model';
import { createPostRequest } from '../../store/posts/posts.actions';
import { MatDialog } from '@angular/material/dialog';
import { ModalWindowComponent } from '../../ui/modal-window/modal-window.component';
import { PostsService } from '../../services/posts.service';
import { WebcamImage } from 'ngx-webcam';
import { HelpersService } from 'src/app/services/helpers.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.sass']
})

export class NewPostComponent implements OnInit {
  form!: FormGroup;
  loading: Observable<boolean>;
  error: Observable<string | null>;
  posts: Observable<Post[]>;
  user!: Observable<User | null>;
  id!: string;
  isAdd = false;
  imageData64!: WebcamImage | null;
  arrHours: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];
  arrMin: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60];
  post: Observable<Post | null>
  isEdit: boolean = false;
  geolocation?: {
    lat: number,
    lng: number
  } | null

  constructor(private store: Store<AppState>,
              private dialog: MatDialog,
              private postsService: PostsService,
              private helpersService: HelpersService,
              private router: Router) {
    this.loading = store.select(state => state.posts.createLoading);
    this.error = store.select(state => state.posts.createError);
    this.post = store.select(state => state.posts.post);
    this.posts = store.select(state => state.posts.posts);
    this.user = store.select(state => state.users.user);
  }

  ngOnInit(): void {
    this.user.subscribe(user => {
      this.id = <string>user?._id;
    });

    if (this.post) {
      this.post.subscribe(post => {
        if (post) {
          this.form = new FormGroup({
            title: new FormControl(post.title, Validators.required),
            content: new FormControl(post.content, Validators.required),
            hours: new FormControl(post.time.hours),
            min: new FormControl(post.time.minutes),
            switchGeolocation: new FormControl(false)
          })
        }
      })
    }

    this.form = new FormGroup({
      title: new FormControl('', Validators.required),
      content: new FormControl('', Validators.required),
      hours: new FormControl(''),
      min: new FormControl(''),
      time: new FormArray([]),
      switchGeolocation: new FormControl()
    })

    navigator.geolocation.getCurrentPosition((position: any) => {
      this.geolocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
        }
      });

    if(this.geolocation === undefined) {
      this.helpersService.openSnackBar('Вы не можете делиться местоположением, пройдите в настройки браузера');
    }

    this.postsService.imageData64.subscribe(imageData64 => {
      this.imageData64 = imageData64
    });

  }

  async onSubmit() {
    const selectTimeObj = {
      hours: this.form.value.hours,
      minutes: this.form.value.min,
    }

    const postData: PostData = {
      user: this.id,
      title: this.form.value.title,
      content: null,
      time: selectTimeObj,
      geolocation: null
    }

    if (this.geolocation) {
      if (this.form.value.switchGeolocation === true) {
        postData.geolocation = JSON.stringify(this.geolocation)
      }
    }


    if (this.form.value.content) {
      postData.content = this.form.value.content
    }
    if (this.imageData64) {
      postData.content = this.imageData64.imageAsBase64
    }
    await this.store.dispatch(createPostRequest({postData}));
    const filterData: FilterData = {
      title: postData.title,
      birthday: '',
      country: '',
      city: '',
      sex: '',
      isPrivate: '',
    }
    const query = {queryParams: {title: filterData.title, birthday: filterData.birthday,
        sex: filterData.sex, country: filterData.country,  city: filterData.city,  isPrivate: filterData.isPrivate}};
    void this.router.navigate([`/statistic`], query);
  }


  addStep() {
    const nameTime = <FormArray>this.form.get('time');
    const group = new FormGroup({
      hours: new FormControl('', Validators.required),
    });
    nameTime.push(group);
    this.isAdd = true;
  }

  getTime() {
    const nameTime = <FormArray>(this.form.get('time'));
    return nameTime.controls;
  }

  openModal() {
    this.dialog.open(ModalWindowComponent, {
      data: {webcam: true}
    });
  }

  onCancel() {
    this.imageData64 = null;
  }

  fieldHasError(fieldName: string, errorType: string) {
    const field = this.form.get(fieldName);
    return Boolean(
      field && field.touched && field.errors?.[errorType]
    );
  }
}
