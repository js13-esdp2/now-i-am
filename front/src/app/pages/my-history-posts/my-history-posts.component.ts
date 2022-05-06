import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Post } from '../../models/post.model';
import { User } from '../../models/user.model';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/types';
import { fetchMyHistoryPostsRequest, fetchOneOfPostRequest } from '../../store/posts.actions';
import { ModalWindowComponent } from '../../ui/modal-window/modal-window.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-history-posts',
  templateUrl: './my-history-posts.component.html',
  styleUrls: ['./my-history-posts.component.sass']
})
export class MyHistoryPostsComponent implements OnInit, OnDestroy {
  posts: Observable<Post[]>;
  loading: Observable<boolean>;
  error: Observable<null | string>;
  user: Observable<User | null>
  user_id!: string;
  isPosts: boolean = false;
  private subUser!: Subscription;

  constructor(private store: Store<AppState>, private  dialog: MatDialog, private router: Router) {
    this.posts = store.select(state => state.posts.posts);
    this.loading = store.select(state => state.posts.fetchLoading);
    this.error = store.select(state => state.posts.fetchError);
    this.user = store.select((state) => state.users.user);

  }

  ngOnInit(): void {
    this.subUser = this.user.subscribe(user => {
      if(user) {
        this.user_id = user._id;
      }
    });
    this.store.dispatch(fetchMyHistoryPostsRequest({user_id: this.user_id}));
  }

  openModal(id: string) {
    this.dialog.open(ModalWindowComponent, {
      data: { removeData: {removePost: true, idPost: id}}
    });
  }

  republish(id: string) {
    this.store.dispatch(fetchOneOfPostRequest( {id: id}))
    void this.router.navigate(['new-post'])
  }

  ngOnDestroy() {
    this.subUser.unsubscribe();
  }
}
