import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/types';
import { User } from '../../models/user.model';
import { searchUsersRequest } from '../../store/search.actions';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.sass']
})
export class SearchComponent implements OnInit {
  @ViewChild('f') form!: NgForm;

  users: Observable<null | User[]>;
  isLoading: Observable<boolean>;
  error: Observable<null | string>;

  constructor(private store: Store<AppState>) {
    this.users = store.select(state => state.search.users);
    this.isLoading = store.select(state => state.search.searchLoading);
    this.error = store.select(state => state.search.searchError);
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    const searchData = (this.form.value).search;
    this.store.dispatch(searchUsersRequest({searchData}))
  }
}
