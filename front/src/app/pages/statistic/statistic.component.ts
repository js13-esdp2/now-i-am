import { Component, OnInit } from '@angular/core';
import { Post } from '../../models/post.model';
import { PostModalComponent } from '../../ui/post-modal/post-modal.component';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/types';
import { MatDialog } from '@angular/material/dialog';
import { fetchTitlePostsRequest } from '../../store/posts.actions';
import { ActivatedRoute } from '@angular/router';
import { MapService } from 'src/app/services/map.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.component.html',
  styleUrls: ['./statistic.component.sass']
})
export class StatisticComponent implements OnInit {

  user: Observable<null | User>;
  posts: Observable<Post[]>;
  isLoading: Observable<boolean>;
  error: Observable<null | string>;
  isSearched = false;
  showList: Boolean = false;

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
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      const title = params['title'];
      this.isSearched = true;
      this.store.dispatch(fetchTitlePostsRequest({title: title}));
    });
    this.mapService.initMap();
    this.getLocation();
  }

  openPost(post: Post): void {
    this.dialog.open(PostModalComponent, {
      data: { postId: post._id }
    });
  }

  openList() {
    this.showList = !this.showList;
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position: any) => {
        if (position) {
          this.mapService.createMarker(position.coords.latitude, position.coords.longitude, 'assets/icons/map-marker.svg')
        }
      })
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  }

}
