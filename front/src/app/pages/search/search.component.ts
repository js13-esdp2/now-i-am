import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/types';
import { MatDialog } from '@angular/material/dialog';
import { PostModalComponent } from '../../ui/post-modal/post-modal.component';
import { fetchTitlePostsRequest, onPostModalDataChange } from '../../store/posts.actions';
import { Post, PostModalData } from '../../models/post.model';
import { PostsService } from '../../services/posts.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.sass']
})
export class SearchComponent implements OnInit, OnDestroy {
  @ViewChild('f') form!: NgForm;
  postObservable!: Observable<PostModalData>;
  post: null | Post = null;
  postModalDataChangeSubscription!: Subscription;

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
    this.postModalDataChangeSubscription = this.postObservable.subscribe((postModalData: PostModalData) => {
      if (postModalData.post && this.post !== postModalData.post) {
        const post = postModalData.post
        this.post = postModalData.post;
        this.dialog.closeAll();
        this.dialog.open(PostModalComponent, {
          data: {post}
        });
        this.isSearched = true;
        setTimeout(() => {
          this.form.setValue({
            search: postModalData.searchTitle,
          })
        },);
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
    const postModalData = {post: post, searchTitle: (this.form.value).search}
    this.store.dispatch(onPostModalDataChange({postModalData}));
  }

  ngOnDestroy() {
    this.postModalDataChangeSubscription.unsubscribe();
  }
}
