import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Post } from '../../models/post.model';
import { User } from '../../models/user.model';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/types';
import { fetchMyHistoryPostsRequest } from '../../store/posts.actions';

@Component({
  selector: 'app-my-history-posts',
  templateUrl: './my-history-posts.component.html',
  styleUrls: ['./my-history-posts.component.sass']
})
export class MyHistoryPostsComponent implements OnInit {
  posts: Observable<Post[]>;
  loading: Observable<boolean>;
  error: Observable<null | string>;
  user: Observable<User | null>
  user_id!: string

  constructor(private store: Store<AppState>) {
    this.posts = store.select(state => state.posts.posts);
    this.loading = store.select(state => state.posts.fetchLoading);
    this.error = store.select(state => state.posts.fetchError);
    this.user = store.select((state) => state.users.user);
  }

  ngOnInit(): void {
    this.user.subscribe(user => {
      if(user) {
        this.user_id = user._id
      }
    })
    this.store.dispatch(fetchMyHistoryPostsRequest({user_id: this.user_id}))
  }

}
