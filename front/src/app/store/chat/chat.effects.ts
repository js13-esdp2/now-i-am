import { Injectable } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  changeChatRoom,
  createNewChatRoom,
  createNewChatRoomFailure,
  createNewChatRoomSuccess, decreaseMessagesCounter,
  deleteAllMessages,
  deleteAllMessagesFailure,
  deleteAllMessagesSuccess,
  deleteChatRoomFailure,
  deleteChatRoomRequest,
  deleteChatRoomSuccess,
  deleteMyMessages,
  deleteMyMessagesFailure,
  deleteMyMessagesSuccess,
  getAllNewMessages, getAllNewMessagesFailure,
  getAllNewMessagesSuccess,
  getChatRoomByIdFailure,
  getChatRoomByIdRequest,
  getChatRoomByIdSuccess,
  getUsersChatRooms,
  getUsersChatRoomsFailure,
  getUsersChatRoomsSuccess, messagesAreReadFailure, messagesAreReadRequest, messagesAreReadSuccess
} from './chat.actions';
import { map, mergeMap, tap } from 'rxjs';
import { HelpersService } from '../../services/helpers.service';
import { Store } from '@ngrx/store';
import { AppState } from '../types';
import { ChatRoom } from '../../models/chatRoom.model';

@Injectable()
export class ChatEffects {
  userId!: string | undefined;
  chatRoom!: ChatRoom;

  constructor(
    private actions: Actions,
    private chatService: ChatService,
    private helpers: HelpersService,
    private store: Store<AppState>,
  ) {
    store.select(state => state.users.user).subscribe((user) => {
      this.userId = user?._id;
    });
    store.select(state => state.chat.chatRoom).subscribe((chatRoom) => {
      if (chatRoom) this.chatRoom = chatRoom;
    });
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
  ));

  deleteMyMessages = createEffect(() => this.actions.pipe(
    ofType(deleteMyMessages),
    mergeMap(({chatRoom}) => this.chatService.deleteMyMessages(chatRoom)
      .pipe(
        tap(() => {
          const chatRoomWithDeletedMessages = {...this.chatRoom, messages: []};
          this.store.dispatch(changeChatRoom({chatRoom: chatRoomWithDeletedMessages}));
          this.store.dispatch(getUsersChatRooms({userId: this.userId}));
        }),
        map(() => deleteMyMessagesSuccess()),
        this.helpers.catchServerError(deleteMyMessagesFailure)
      ))
  ))

  deleteAllMessages = createEffect(() => this.actions.pipe(
    ofType(deleteAllMessages),
    mergeMap(({chatRoom}) => this.chatService.deleteAllMessages(chatRoom)
      .pipe(
        tap(() => {
          const chatRoomWithDeletedMessages = {...this.chatRoom, messages: []};
          this.store.dispatch(changeChatRoom({chatRoom: chatRoomWithDeletedMessages}));
          this.store.dispatch(getUsersChatRooms({userId: this.userId}));
        }),
        map(() => deleteAllMessagesSuccess()),
        this.helpers.catchServerError(deleteAllMessagesFailure)
      ))
  ));

  deleteChatRoom = createEffect(() => this.actions.pipe(
    ofType(deleteChatRoomRequest),
    mergeMap(({chatRoom}) => this.chatService.deleteChatRoom(chatRoom)
      .pipe(
        tap(() => {
          this.store.dispatch(getUsersChatRooms({userId: this.userId}));
        }),
        map(() => deleteChatRoomSuccess()),
        this.helpers.catchServerError(deleteChatRoomFailure)
      ))
  ));

  getChatRoomByID = createEffect(() => this.actions.pipe(
    ofType(getChatRoomByIdRequest),
    mergeMap(({chatRoomId}) => this.chatService.getChatRoomById(chatRoomId)
      .pipe(
        map((chatRoom) => {
          return getChatRoomByIdSuccess({chatRoom})
        }),
        tap(({chatRoom}) => this.store.dispatch(getUsersChatRooms({userId: this.userId}))),
        this.helpers.catchServerError(getChatRoomByIdFailure)
      ))
  ));

  getUsersAllNewMessages = createEffect(() => this.actions.pipe(
    ofType(getAllNewMessages),
    mergeMap(({userId}) => this.chatService.getUsersAllNewMessages(userId)
      .pipe(
        map((newMessages) => getAllNewMessagesSuccess({newMessages})),
        this.helpers.catchServerError(getAllNewMessagesFailure)
      ))
  ));

  messagesAreRead = createEffect(() => this.actions.pipe(
    ofType(messagesAreReadRequest),
    mergeMap(({messagesAreReadData}) => this.chatService.messagesAreRead(messagesAreReadData)
      .pipe(
        map(() => messagesAreReadSuccess()),
        this.helpers.catchServerError(messagesAreReadFailure)
      ))
  ))
}
