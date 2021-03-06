import { ChatState } from '../types';
import { createReducer, on } from '@ngrx/store';
import {
  addNewMessageToChatRoom,
  addNewMessageToNewMessagesCounter,
  changeChatRoom,
  createNewChatRoom,
  createNewChatRoomFailure,
  createNewChatRoomSuccess,
  decreaseMessagesCounter,
  deleteAllMessages,
  deleteAllMessagesFailure,
  deleteAllMessagesSuccess,
  deleteChatRoomFailure,
  deleteChatRoomRequest,
  deleteChatRoomSuccess,
  deleteMyMessages,
  deleteMyMessagesFailure,
  deleteMyMessagesSuccess,
  getAllNewMessages,
  getAllNewMessagesFailure,
  getAllNewMessagesSuccess,
  getChatRoomByIdFailure,
  getChatRoomByIdRequest,
  getChatRoomByIdSuccess,
  getUsersChatRooms,
  getUsersChatRoomsFailure,
  getUsersChatRoomsSuccess, messagesAreReadFailure, messagesAreReadRequest, messagesAreReadSuccess
} from './chat.actions';

const initialState: ChatState = {
  chatRoom: null,
  chatRooms: [],
  allNewMessages: 0,
  fetchLoading: false,
  fetchError: null,
  createLoading: false,
  createError: null,
  deleteLoading: true,
  deleteError: null,
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
  on(deleteMyMessages, (state) => ({...state, deleteLoading: true})),
  on(deleteMyMessagesSuccess, (state) => ({...state})),
  on(deleteMyMessagesFailure, (state, {error}) => ({...state, deleteLoading: false, deleteError: error})),
  on(deleteAllMessages, (state) => ({...state, deleteLoading: true})),
  on(deleteAllMessagesSuccess, (state) => ({...state})),
  on(deleteAllMessagesFailure, (state, {error}) => ({...state, deleteLoading: false, deleteError: error})),
  on(deleteChatRoomRequest, (state) => ({...state, deleteLoading: true})),
  on(deleteChatRoomSuccess, (state) => ({...state, deleteLoading: false})),
  on(deleteChatRoomFailure, (state, {error}) => ({...state, deleteLoading: false, deleteError: error})),
  on(getChatRoomByIdRequest, (state) => ({...state, fetchLoading: true})),
  on(getChatRoomByIdSuccess, (state, {chatRoom}) => ({...state, fetchLoading: false, chatRoom})),
  on(getChatRoomByIdFailure, (state, {error}) => ({...state, fetchLoading: false, fetchError: error})),
  on(getAllNewMessages, (state) => ({...state, fetchLoading: true})),
  on(getAllNewMessagesSuccess, (state, {newMessages}) => ({
    ...state,
    fetchLoading: false,
    allNewMessages: newMessages.allNewMessages
  })),
  on(getAllNewMessagesFailure, (state) => ({...state, fetchLoading: false})),
  on(addNewMessageToNewMessagesCounter, (state) => ({...state, allNewMessages: state.allNewMessages + 1})),
  on(decreaseMessagesCounter, (state, {decreaseNumber}) => {
      if (state.allNewMessages === 0 || state.allNewMessages < 0) {
        return state;
      }
      const updatedAllNewMessages = state.allNewMessages - decreaseNumber;
      return {...state, allNewMessages: updatedAllNewMessages};
    }
  ),
  on(messagesAreReadRequest, (state) => ({...state, fetchLoading: true})),
  on(messagesAreReadSuccess, (state) => ({...state, fetchLoading: false})),
  on(messagesAreReadFailure, (state, {error}) => ({...state, fetchLoading: false, fetchError: error})),
)
