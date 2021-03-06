import { Component, OnDestroy, OnInit } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';
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
export class LayoutComponent implements OnInit, OnDestroy {
  user: Observable<null | User>;
  websocketFriendSub!: Subscription;
  apiUrl = env.apiUrl;
  newMessagesAmount = 0;
  isHidden = true;

  breakpoint = 768;
  mobWindow = false;

  notifications!: number;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private store: Store<AppState>,
    private websocketService: WebsocketService,
  ) {
    this.user = store.select((state) => state.users.user);
    store.select(state => state.chat.allNewMessages).subscribe(newMessagesAmount => {
      this.newMessagesAmount = newMessagesAmount;
      this.isHidden = newMessagesAmount === 0;
    });
  }

  ngOnInit() {
    this.mobWindow = this.breakpoint >= window.innerWidth;
    this.websocketFriendSub = this.websocketService.onEvent<NotificationMessage>('ADD_FRIEND').subscribe(({message, ws}) => {
      this.notifications = message.notifications;
      setTimeout(() => {
        if (window.location.href.includes('/notifications')) {
          this.notifications = 0;
        }
      }, 1500);
    });
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

  ngOnDestroy() {
    this.websocketFriendSub.unsubscribe();
  }
}
