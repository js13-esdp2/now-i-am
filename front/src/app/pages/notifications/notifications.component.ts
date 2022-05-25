import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/types';
import { Friends } from '../../models/frends.model';
import { fetchFriendsRequest, removeFriendRequest } from '../../store/users/users.actions';
import { environment } from '../../../environments/environment';
import { WebsocketService } from '../../services/websocket.service';


@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.sass']
})
export class NotificationsComponent implements OnInit {
  friends: Observable<Friends[]>;
  user: Observable<User | null>;
  loading: Observable<boolean>;
  apiUrl = environment.apiUrl

  constructor(
    private store: Store<AppState>,
    private wsService: WebsocketService,
    ) {
    this.user = store.select((state) => state.users.user);
    this.friends = store.select(state => state.users.friends);
    this.loading = store.select(state => state.users.fetchFriendsLoading);
  }

  ngOnInit(): void {
    this.store.dispatch(fetchFriendsRequest());
    this.wsService.onEvent('ADD_FRIEND').subscribe((message: any) => {
      if (message){
        this.store.dispatch(fetchFriendsRequest());
      }
    })
  }

  onRemove(friendId: string) {
    this.store.dispatch(removeFriendRequest({friendId}));
  }
}
