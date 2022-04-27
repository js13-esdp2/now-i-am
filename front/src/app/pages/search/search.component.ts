import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/types';
import { MatDialog } from '@angular/material/dialog';
import { PostModalComponent } from '../../ui/post-modal/post-modal.component';
import { fetchTitlePostsRequest, onPostModalDataChange } from '../../store/posts.actions';
import { Post } from '../../models/post.model';
import { PostsService } from '../../services/posts.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.sass']
})
export class SearchComponent implements OnInit, OnDestroy {
  @ViewChild('f') form!: NgForm;
  postObservable!: Observable<null | Post>;
  post: null | Post = null;
  postModalChangeSubscription!: Subscription;

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
    this.postObservable = store.select(state => state.posts.postModalData);
  }

  ngOnInit(): void {
    this.post = null;
    this.postModalChangeSubscription = this.postObservable.subscribe((post: null | Post) => {
      if (post && this.post !== post) {
        this.post = post;
        this.dialog.closeAll();
        this.dialog.open(PostModalComponent, {
          data: {post}
        });
      }
    });
  }

  onSubmit(): void {
    this.isSearched = true;
    const searchTitle = (this.form.value).search;
    this.store.dispatch(fetchTitlePostsRequest({title: searchTitle}));
  }

  openPost(post: Post): void {
    this.dialog.open(PostModalComponent, {
      data: {post}
    });
    this.store.dispatch(onPostModalDataChange({post}));
  }

  ngOnDestroy() {
    this.postModalChangeSubscription.unsubscribe();
  }
}
