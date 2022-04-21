import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/types';
import { MatDialog } from '@angular/material/dialog';
import { PostModalComponent } from '../../ui/post-modal/post-modal.component';
import { fetchTitlePostsRequest } from '../../store/posts.actions';
import { Post } from '../../models/post.model';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.sass']
})
export class SearchComponent {
  @ViewChild('f') form!: NgForm;

  posts: Observable<Post[]>;
  isLoading: Observable<boolean>;
  error: Observable<null | string>;

  isSearched = false;

  constructor(
    private store: Store<AppState>,
    private dialog: MatDialog,
  ) {
    this.posts = store.select(state => state.posts.posts);
    this.isLoading = store.select(state => state.posts.fetchLoading);
    this.error = store.select(state => state.posts.fetchError);
  }

  onSubmit(): void {
    this.isSearched = true;

    const searchTitle = (this.form.value).search;
    this.store.dispatch(fetchTitlePostsRequest({ title: searchTitle }));
  }

  openPost(post: Post): void {
    this.dialog.open(PostModalComponent, {
      data: { post }
    });
  }

}
