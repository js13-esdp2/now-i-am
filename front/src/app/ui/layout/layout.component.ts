import { Component, OnInit } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';
import { logoutUserRequest } from '../../store/users/users.actions';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/types';
import { environment as env } from '../../../environments/environment';


@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.sass']
})
export class LayoutComponent implements OnInit{

  breakpoint = 768;
  mobWindow = false;
  user: Observable<null | User>;
  apiUrl = env.apiUrl;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private store: Store<AppState>,
  ) {
    this.user = store.select((state) => state.users.user);
  }

  ngOnInit() {
    this.mobWindow = this.breakpoint >= window.innerWidth;
  }

  logout() {
    this.store.dispatch(logoutUserRequest());
  }

  onResize(event: any) {
    this.mobWindow = this.breakpoint >= event.target.innerWidth;
  }
}
