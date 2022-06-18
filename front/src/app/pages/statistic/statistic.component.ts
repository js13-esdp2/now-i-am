import { Component, OnDestroy, OnInit } from '@angular/core';
import { Post, PostModalData } from '../../models/post.model';
import { PostModalComponent } from '../../ui/post-modal/post-modal.component';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/types';
import { MatDialog } from '@angular/material/dialog';
import { fetchTitlePostsRequest, onPostModalDataChange } from '../../store/posts/posts.actions';
import { ActivatedRoute, Router } from '@angular/router';
import { MapService } from 'src/app/services/map.service';
import { ApiUserData, User } from '../../models/user.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.component.html',
  styleUrls: ['./statistic.component.sass']
})
export class StatisticComponent implements OnInit, OnDestroy{
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
  paramsSub!: Subscription;
  postSub!: Subscription;
  visibility: boolean = true;
  apiUrl = environment.apiUrl

  constructor(
    private store: Store<AppState>,
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private mapService: MapService,
    private router: Router,
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
    this.paramsSub = this.activatedRoute.queryParams.subscribe(queryParams => {
      const filterData = {
        title: queryParams['title'],
        birthday: queryParams['birthday'],
        sex: queryParams['sex'],
        city: queryParams['city'],
        isPrivate: queryParams['isPrivate']
      }
      this.store.dispatch(fetchTitlePostsRequest({filterData: filterData}));
    })
    this.isSearched = true;
    this.openPreviousPost();
    this.mapService.initMap();
    this.postSub = this.posts.subscribe(posts => {
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

  changeTemplate() {
    this.visibility=!this.visibility;
  }


  reply() {
    void this.router.navigate(['./'])
  }

  ngOnDestroy(): void {
    this.paramsSub.unsubscribe();
    this.postSub.unsubscribe();
  }

}
