import { Component, OnInit } from '@angular/core';
import { Post, PostModalData } from '../../models/post.model';
import { PostModalComponent } from '../../ui/post-modal/post-modal.component';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/types';
import { MatDialog } from '@angular/material/dialog';
import { onPostModalDataChange } from '../../store/posts/posts.actions';
import { ActivatedRoute } from '@angular/router';
import { MapService } from 'src/app/services/map.service';
import { ApiUserData, User } from '../../models/user.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.component.html',
  styleUrls: ['./statistic.component.sass']
})
export class StatisticComponent implements OnInit {
  user: Observable<null | User>;
  userData!: null | User;
  posts: Observable<Post[]>;
  isLoading: Observable<boolean>;
  error: Observable<null | string>;
  isSearched = false;
  showList: Boolean = false;
  postModalData!: PostModalData;
  searchTitle!: string;
  userId!: ApiUserData;

  constructor(
    private store: Store<AppState>,
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private mapService: MapService,
  ) {
    this.posts = store.select(state => state.posts.posts);
    this.isLoading = store.select(state => state.posts.fetchLoading);
    this.error = store.select(state => state.posts.fetchError);
    this.user = store.select((state) => state.users.user);
    store.select(state => state.posts.postModalData).subscribe(postModalData => {
      this.postModalData = postModalData;
    });
    store.select(state => state.users.user).subscribe(user => {
      this.userData = user;
    })
  }

  ngOnInit(): void {
    this.mapService.initMap();
    this.isSearched = true;
    this.openPreviousPost();
    this.posts.subscribe(posts => {
      if(posts){
        posts.forEach((post) =>{
          if(post.geolocation) {
            const userInfo = {
              name: post.user.displayName,
              content: post.content,
              title: post.title,
            }
            this.mapService.createMarker(post.geolocation.lat, post.geolocation.lng, `${environment.apiUrl + '/uploads/' + post.user.photo}`, userInfo)
          }
        })
      }
    });
  }

  openPost(post: Post): void {
    this.dialog.open(PostModalComponent, {
      data: {postId: post._id}
    });
    const postModalData = {
      postId: post._id,
      searchTitle: this.searchTitle,
    }
    this.store.dispatch(onPostModalDataChange({postModalData}));
  }

  openList() {
    this.showList = !this.showList;
  }

  openPreviousPost() {
    if (this.postModalData.postId) {
      this.dialog.open(PostModalComponent, {
        data: {postId: this.postModalData.postId}
      });
    }
  }
}
