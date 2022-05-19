import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { Observable, startWith, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/types';
import { MatDialog } from '@angular/material/dialog';
import { PostModalComponent } from '../../ui/post-modal/post-modal.component';
import { Post, PostModalData } from '../../models/post.model';
import { ApiCountryData } from '../../models/user.model';
import { fetchCountriesRequest } from '../../store/users/users.actions';
import { fetchTitlePostsRequest } from '../../store/posts/posts.actions';
import { map } from 'rxjs/operators';

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
  countrySub!: Subscription;

  posts: Observable<Post[]>;
  isLoading: Observable<boolean>;
  error: Observable<null | string>;
  postModalData!: PostModalData;

  myControl = new FormControl();
  options!: ApiCountryData[];
  filteredOptions!: Observable<ApiCountryData[]>;

  isSearched = false;
  panelOpenState = false;

  constructor(
    private store: Store<AppState>,
    private dialog: MatDialog,
  ) {
    this.posts = store.select(state => state.posts.posts);
    this.country = store.select((state) => state.users.country);
    this.isLoading = store.select(state => state.posts.fetchLoading);
    this.error = store.select(state => state.posts.fetchError);
    this.postObservable = store.select(state => state.posts.postModalData);
  }

  ngOnInit() {
    this.countrySub = this.country.subscribe(countryInfo => {
      this.options = countryInfo;
    });
    this.store.dispatch(fetchCountriesRequest());

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value.city)),
      map(city => (city ? this._filter(city) : this.options.slice())),
    );
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

  displayFn(data: ApiCountryData): string {
    return data && data.city ? data.city : '';
  }

  private _filter(city: string): ApiCountryData[] {
    const filterValue = city.toLowerCase();
    return this.options.filter(option => option.city.toLowerCase().includes(filterValue));
  }

  ngOnDestroy(): void {
    this.countrySub.unsubscribe();
  }
}
