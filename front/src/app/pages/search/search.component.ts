import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/types';
import { MatDialog } from '@angular/material/dialog';
import { PostModalComponent } from '../../ui/post-modal/post-modal.component';
import { Post, PostModalData } from '../../models/post.model';
import { ApiCountryData, City } from '../../models/user.model';
import { fetchCountriesRequest } from '../../store/users.actions';
import { fetchTitlePostsRequest } from '../../store/posts.actions';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.sass']
})
export class SearchComponent implements OnInit, OnDestroy {
  @ViewChild('f') form!: NgForm;
  postObservable!: Observable<PostModalData>;
  post: null | Post = null;
  country: Observable<ApiCountryData[]>;
  capital: Observable<City[]>;
  countrySub!: Subscription;

  posts: Observable<Post[]>;
  isLoading: Observable<boolean>;
  error: Observable<null | string>;
  postModalData!: PostModalData;

  town: boolean = true;
  countryData: ApiCountryData [] | null = null;
  city: string [] = [];

  isSearched = false;
  panelOpenState = false;

  constructor(
    private store: Store<AppState>,
    private dialog: MatDialog,
  ) {
    this.posts = store.select(state => state.posts.posts);
    this.country = store.select((state) => state.users.country);
    this.capital = store.select((state) => state.users.capital);
    this.isLoading = store.select(state => state.posts.fetchLoading);
    this.error = store.select(state => state.posts.fetchError);
    this.postObservable = store.select(state => state.posts.postModalData);
  }

  ngOnInit() {
    this.countrySub = this.country.subscribe(countryInfo => {
      this.countryData = countryInfo;
    });
    this.store.dispatch(fetchCountriesRequest());
  }

  onSplitCapitalToCountry(capital: string) {
    this.town = false;
    this.countryData?.forEach(country => {
      if (country.name.official === capital) {
        this.city = country.capital;
      }
    });
  }

  onSubmit(): void {
    this.isSearched = true;
    const filterData = this.form.value;
    this.store.dispatch(fetchTitlePostsRequest({filterData: filterData}));
  }

  openPost(post: Post): void {
    this.dialog.open(PostModalComponent, {
      data: {postId: post._id}
    });
  }

  ngOnDestroy(): void {
    this.countrySub.unsubscribe();
  }
}
