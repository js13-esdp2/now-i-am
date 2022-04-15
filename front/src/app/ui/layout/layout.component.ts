import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { User } from '../../models/user.model';
import { logoutUserRequest } from '../../store/users.actions';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/types';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.sass']
})
export class LayoutComponent implements OnInit{

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  isOpen = true;
  changeOnMenuReg = false;
  breakpoint: number = 768;
  user: Observable<null | User>;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private store: Store<AppState>,
  ) {
    this.user = store.select((state) => state.users.user);
  }

  ngOnInit() {
    this.changeOnMenuReg = this.breakpoint >= window.innerWidth;
  }

  onChange() {
    this.isOpen = !this.isOpen;
  }

  logout() {
    this.store.dispatch(logoutUserRequest());
  }

  onResize(event: any) {
    this.changeOnMenuReg = this.breakpoint >= event.target.innerWidth;
  }
}
