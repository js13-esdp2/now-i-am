import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from './store/types';
import { ChatService } from './services/chat.service';
import { Observable, Subscription } from 'rxjs';
import { User } from './models/user.model';
import { WebsocketService } from './services/websocket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit, OnDestroy {
  usersIdObservable!: Observable<null | User>;
  usersIdSub!: Subscription;

  constructor(
    private store: Store<AppState>,
    private chatService: ChatService,
    private websocketService: WebsocketService,
    ) {
    this.usersIdObservable = store.select(state => state.users.user);
  }

  ngOnInit(): void {
     this.usersIdSub = this.usersIdObservable.subscribe(user => {
       if (user?._id) {
         const userId = user._id.toString();
         this.websocketService.openWebSocket(userId);
       }
    })
  }

  ngOnDestroy(): void {
    this.usersIdSub.unsubscribe();
  }
}
