import { Component, OnInit } from '@angular/core';
import { Post } from '../../models/post.model';
import { PostModalComponent } from '../../ui/post-modal/post-modal.component';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/types';
import { MatDialog } from '@angular/material/dialog';
import { fetchTitlePostsRequest } from '../../store/posts.actions';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.component.html',
  styleUrls: ['./statistic.component.sass']
})
export class StatisticComponent implements OnInit {
  posts: Observable<Post[]>;
  isLoading: Observable<boolean>;
  error: Observable<null | string>;
  isSearched = false;
  showList: Boolean = false;

  zoom = 12
  center!: google.maps.LatLngLiteral
  options: google.maps.MapOptions = {
    zoomControl: false,
    scrollwheel: false,
    disableDoubleClickZoom: true,
    mapTypeId: 'hybrid',
    maxZoom: 30,
    minZoom: 8,
  }

  constructor(
    private store: Store<AppState>,
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute
  ) {
    this.posts = store.select(state => state.posts.posts);
    this.isLoading = store.select(state => state.posts.fetchLoading);
    this.error = store.select(state => state.posts.fetchError);
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
       const title = params['title'];
      this.isSearched = true;
      this.store.dispatch(fetchTitlePostsRequest({ title: title }));
    });

    navigator.geolocation.getCurrentPosition((position) => {
      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      }
    })
  }

  openPost(post: Post): void {
    this.dialog.open(PostModalComponent, {
      data: { post }
    });
  }

  openList() {
    this.showList = !this.showList;
  }

  zoomIn() {
    if (this.zoom < this.options.maxZoom!) this.zoom++
  }

  zoomOut() {
    if (this.zoom > this.options.minZoom!) this.zoom--
  }

}
