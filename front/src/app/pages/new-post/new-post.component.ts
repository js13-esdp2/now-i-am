import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/types';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Post, PostData } from '../../models/post.model';
import { createPostRequest, fetchPostsRequest } from '../../store/posts.actions';
import { MatDialog } from '@angular/material/dialog';
import { ModalWindowComponent } from '../../ui/modal-window/modal-window.component';
import { PostsService } from '../../services/posts.service';
import { WebcamImage } from 'ngx-webcam';

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

  constructor(private store: Store<AppState>, private dialog: MatDialog, private postsService: PostsService) {
    this.loading = store.select(state => state.posts.createLoading);
    this.error = store.select(state => state.posts.createError);
    this.posts = store.select(state => state.posts.posts);
    this.user = store.select(state => state.users.user);
  }

  ngOnInit(): void {
    this.store.dispatch(fetchPostsRequest());
    this.user.subscribe(user => {
      this.id = <string>user?._id;
    })

    this.form = new FormGroup({
      title: new FormControl('', Validators.required),
      content: new FormControl('', Validators.required),
      time: new FormArray([]),
    })

    this.postsService.imageData64.subscribe( imageData64 => {
      this.imageData64 = imageData64
    })
  }

  onSubmit() {
    const timeData = (this.form.value.time)[0].hours.split(':');
    const timeObj = {
      hours: timeData[0],
      minutes: timeData[1]
    }

    const postData: PostData = {
      user: this.id,
      title: this.form.value.title,
      content: null,
      time: timeObj,
    }

    if (this.form.value.content) {
      postData.content = this.form.value.content
    }
    if (this.imageData64) {
      postData.content = this.imageData64.imageAsBase64
    }

    this.store.dispatch(createPostRequest({postData}))
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
    this.dialog.open(ModalWindowComponent);
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
