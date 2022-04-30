import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/types';
import { MatDialog } from '@angular/material/dialog';
import { PostModalComponent } from '../../ui/post-modal/post-modal.component';
import { Post, PostModalData } from '../../models/post.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.sass']
})
export class SearchComponent {
  @ViewChild('f') form!: NgForm;
  postObservable!: Observable<PostModalData>;
  post: null | Post = null;

  posts: Observable<Post[]>;
  isLoading: Observable<boolean>;
  error: Observable<null | string>;
  postModalData!: PostModalData;

  isSearched = false;

  constructor(
    private store: Store<AppState>,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.posts = store.select(state => state.posts.posts);
    this.isLoading = store.select(state => state.posts.fetchLoading);
    this.error = store.select(state => state.posts.fetchError);
    this.postObservable = store.select(state => state.posts.postModalData);
  }

  onSubmit(): void {
    this.isSearched = true;
    const searchTitle = (this.form.value).search;
    void this.router.navigate(['/statistic'], {queryParams: {title: searchTitle}})
  }

  openPost(post: Post): void {
    this.dialog.open(PostModalComponent, {
      data: { postId: post._id }
    });
  }
}
