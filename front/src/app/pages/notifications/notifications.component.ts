import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { User } from '../../models/user.model';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/types';
import { Friends } from '../../models/frends.model';
import {
  confirmationOfFriendshipRequest,
  fetchFriendsRequest,
  removeFriendRequest
} from '../../store/users/users.actions';
import { environment } from '../../../environments/environment';
import { WebsocketService } from '../../services/websocket.service';


@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.sass']
})
export class NotificationsComponent implements OnInit, OnDestroy {
  friends: Observable<Friends[]>;
  user: Observable<User | null>;
  loading: Observable<boolean>;
  apiUrl = environment.apiUrl
  notNewRequests: boolean = false;

  websocketFriendSub!: Subscription;
  friendSub!: Subscription;

  constructor(
    private store: Store<AppState>,
    private websocketService: WebsocketService,
    ) {
    this.user = store.select((state) => state.users.user);
    this.friends = store.select(state => state.users.friends);
    this.loading = store.select(state => state.users.fetchFriendsLoading);
  }

  ngOnInit(): void {
    this.store.dispatch(fetchFriendsRequest());
    this.websocketFriendSub = this.websocketService.onEvent('ADD_FRIEND').subscribe((message: any) => {
      if (message){
        this.store.dispatch(fetchFriendsRequest());
      }
    });

    this.friendSub = this.friends.subscribe((friends) => {
      const idFriendRequestsAccepted = friends.reduce((acc: boolean, val) => {
        return acc && val.isFriend;
      }, true);

      this.notNewRequests = !idFriendRequestsAccepted;

      // this.notNewRequests = friends.length > 0;
      // friends.forEach(friend => {
      //   this.notNewRequests = !friend.isFriend
      // })
    });
  }

  confirmationOfFriendship(friendId: string){
    this.store.dispatch(confirmationOfFriendshipRequest({friendId}));
  };

  onRemove(friendId: string) {
    this.store.dispatch(removeFriendRequest({friendId}));
  }

  ngOnDestroy(): void {
    this.websocketFriendSub.unsubscribe();
    this.friendSub.unsubscribe();
  }
}
