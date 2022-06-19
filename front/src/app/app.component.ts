import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from './store/types';
import { Observable, Subscription } from 'rxjs';
import { User } from './models/user.model';
import { WebsocketService } from './services/websocket.service';
import { getAllNewMessages } from './store/chat/chat.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {
  user: Observable<null | User>;
  userSub!: Subscription;
  title= 'Now-I-Am';

  constructor(
    private store: Store<AppState>,
    private websocketService: WebsocketService,
  ) {
    this.user = store.select(state => state.users.user);
  }

  ngOnInit(): void {
    this.userSub = this.user.subscribe((user) => {
      if (user) {
        this.websocketService.userConnect(user._id);
        this.store.dispatch(getAllNewMessages({userId: user._id}));
      } else {
        this.websocketService.userDisconnect();
      }
    });
  }
}
