import { Injectable } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  createNewChatRoom, createNewChatRoomFailure, createNewChatRoomSuccess,
  getUsersChatRooms,
  getUsersChatRoomsFailure,
  getUsersChatRoomsSuccess
} from './chat.actions';
import { map, mergeMap, tap } from 'rxjs';
import { HelpersService } from '../../services/helpers.service';
import { Store } from '@ngrx/store';
import { AppState } from '../types';

@Injectable()
export class ChatEffects {
  userId!: string | undefined;

  constructor(
    private actions: Actions,
    private chatService: ChatService,
    private helpers: HelpersService,
    private store: Store<AppState>,
  ) {
    store.select(state => state.users.user).subscribe((user) => {
      this.userId = user?._id;
    })
  }

  fetchChatRooms = createEffect(() => this.actions.pipe(
    ofType(getUsersChatRooms),
    mergeMap(({userId}) => this.chatService.getUsersChatRooms(userId)
      .pipe(
        map(chatRooms => getUsersChatRoomsSuccess({chatRooms})),
        this.helpers.catchServerError(getUsersChatRoomsFailure)
      ))
  ));

  createNewChatRoom = createEffect(() => this.actions.pipe(
    ofType(createNewChatRoom),
    mergeMap(({chatRoomData}) => this.chatService.newChatRoom(chatRoomData)
      .pipe(
        tap(() => this.store.dispatch(getUsersChatRooms({userId: this.userId}))),
        map(() => createNewChatRoomSuccess()),
        this.helpers.catchServerError(createNewChatRoomFailure)
      ))
  ))
}
