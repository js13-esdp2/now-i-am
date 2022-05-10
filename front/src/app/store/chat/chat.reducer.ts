import { ChatState } from '../types';
import { createReducer, on } from '@ngrx/store';
import {
  addNewMessageToChatRoom,
  changeChatRoom,
  createNewChatRoom,
  createNewChatRoomFailure,
  createNewChatRoomSuccess,
  getUsersChatRooms,
  getUsersChatRoomsFailure,
  getUsersChatRoomsSuccess
} from './chat.actions';

const initialState: ChatState = {
  chatRoom: null,
  chatRooms: [],
  fetchLoading: false,
  fetchError: null,
  createLoading: false,
  createError: null,
};
export const chatReducer = createReducer(
  initialState,
  on(getUsersChatRooms, (state) => ({...state, fetchLoading: true})),
  on(getUsersChatRoomsSuccess, (state, {chatRooms}) => ({...state, fetchLoading: false, chatRooms})),
  on(getUsersChatRoomsFailure, (state, {error}) => ({...state, fetchLoading: false, fetchError: error})),
  on(createNewChatRoom, (state) => ({...state, createLoading: true})),
  on(createNewChatRoomSuccess, (state) => ({...state, createLoading: false})),
  on(createNewChatRoomFailure, (state, {error}) => ({...state, createLoading: false, createError: error})),
  on(changeChatRoom, (state, {chatRoom}) => ({...state, chatRoom})),
  on(addNewMessageToChatRoom, (state, {newMessage}) => {
    let chatRooms = [...state.chatRooms];
    let upDatedChatRoom;
    let updatedChatRooms = chatRooms.map((item) => {
      let chatRoom = {...item};
      if (item.chatRoomInbox === newMessage.chatRoomInbox) {
        chatRoom = {...item, lastMessage: newMessage.text};
        upDatedChatRoom = chatRoom;
        let messages = [...chatRoom.messages];
        messages.push(newMessage);
        chatRoom.messages = messages;
        Object.preventExtensions(chatRoom);
      }
      return chatRoom;
    });

    return {...state, chatRooms: updatedChatRooms, chatRoom: upDatedChatRoom};
  }),
)
