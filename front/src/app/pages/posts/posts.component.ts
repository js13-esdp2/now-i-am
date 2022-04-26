import { Component, OnInit } from '@angular/core';
import { Post } from '../../models/post.model';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/types';
import { ActivatedRoute } from '@angular/router';
import { PostsService } from '../../services/posts.service';
import { fetchPostsRequest } from '../../store/posts.actions';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.sass']
})
export class PostsComponent implements OnInit {
  posts: Observable<Post[]>;
  loading: Observable<boolean>;
  error: Observable<null | string>;
  user: Observable<User | null>;


  constructor(private store: Store<AppState>,
  ) {
    this.posts = store.select(state => state.posts.posts);
    this.loading = store.select(state => state.posts.fetchLoading);
    this.error = store.select(state => state.posts.fetchError);
    this.user = store.select(state => state.users.user);
  }

  ngOnInit(): void {
    this.store.dispatch(fetchPostsRequest());
  }
}
