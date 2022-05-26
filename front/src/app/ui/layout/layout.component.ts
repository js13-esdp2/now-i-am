import { Component, OnInit } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';
import { logoutUserRequest } from '../../store/users/users.actions';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/types';
import { environment as env } from '../../../environments/environment';
import { WebsocketMessage, WebsocketService } from '../../services/websocket.service';

export interface NotificationMessage extends WebsocketMessage {
  notifications: number,
}

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.sass']
})
export class LayoutComponent implements OnInit {
  user: Observable<null | User>;
  apiUrl = env.apiUrl;
  currentUrl = 'http://localhost:4200/notifications';

  breakpoint = 768;
  mobWindow = false;

  notifications!: number;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private store: Store<AppState>,
    private wsService: WebsocketService,
  ) {
    this.user = store.select((state) => state.users.user);
  }

  ngOnInit() {
    this.mobWindow = this.breakpoint >= window.innerWidth;
    this.wsService.onEvent('ADD_FRIEND').subscribe((message:{message: NotificationMessage | WebsocketMessage, ws: WebSocket}) => {
      this.notifications = message.message.notifications;
      setTimeout(() => {
        if (window.location.href === this.currentUrl) {
          this.notifications = 0;
        }
      }, 1500);
    })
  }

  logout() {
    this.store.dispatch(logoutUserRequest());
  }

  onResize(event: any) {
    this.mobWindow = this.breakpoint >= event.target.innerWidth;
  }

  clearNotifications() {
    this.notifications = 0;
  }
}
