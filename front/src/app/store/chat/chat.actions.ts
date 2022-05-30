import { createAction, props } from '@ngrx/store';
import { ChatRoomData, ChatRoom } from '../../models/chatRoom.model';
import { Message, NewMessages } from '../../models/message.model';

export const createNewChatRoom = createAction('[Chat] Post ChatRoom Request', props<{ chatRoomData: ChatRoomData }>());
export const createNewChatRoomSuccess = createAction('[Chat] Post ChatRoom Success');
export const createNewChatRoomFailure = createAction('[Chat] Post ChatRoom Failure', props<{ error: string }>());

export const getUsersChatRooms = createAction('[Chat] Fetch Request', props<{ userId: string | undefined }>());
export const getUsersChatRoomsSuccess = createAction('[Chat] Fetch Success', props<{ chatRooms: ChatRoom[] }>());
export const getUsersChatRoomsFailure = createAction('[Chat] Fetch Failure', props<{ error: string }>());

export const changeChatRoom = createAction('[Chat] Change Chat', props<{ chatRoom: ChatRoom | null }>());
export const addNewMessageToChatRoom = createAction('[Chat] Add Message', props<{ newMessage: Message }>());

export const deleteMyMessages = createAction('[Chat] Delete My Messages', props<{ chatRoom: ChatRoom }>());
export const deleteMyMessagesSuccess = createAction('[Chat] Delete My Messages Success');
export const deleteMyMessagesFailure = createAction('[Chat] Delete My Messages Failure', props<{ error: string }>());

export const deleteAllMessages = createAction('[Chat] Delete All Messages', props<{ chatRoom: ChatRoom }>());
export const deleteAllMessagesSuccess = createAction('[Chat] Delete All Messages Success');
export const deleteAllMessagesFailure = createAction('[Chat] Delete All Messages Failure', props<{ error: string }>());

export const deleteChatRoomRequest = createAction('[Chat] Delete Chat Room Request', props<{ chatRoom: ChatRoom }>());
export const deleteChatRoomSuccess = createAction('[Chat] Delete Chat Room Success');
export const deleteChatRoomFailure = createAction('[Chat] Delete Chat Room Failure', props<{ error: string }>());

export const getChatRoomByIdRequest = createAction('[Chat] Get ChatRoom Request', props<{ chatRoomId: string | null }>());
export const getChatRoomByIdSuccess = createAction('[Chat] Get ChatRoom Success', props<{ chatRoom: ChatRoom }>());
export const getChatRoomByIdFailure = createAction('[Chat] Get ChatRoom Failure', props<{ error: string }>());

export const getAllNewMessages = createAction('[Chat] Get All New Messages', props<{ userId: string | undefined }>());
export const getAllNewMessagesSuccess = createAction('[Chat] All New Messages Success', props<{ newMessages: NewMessages }>());
export const getAllNewMessagesFailure = createAction('[Chat]All New Messages Failure', props<{ error: string | null }>());

export const addNewMessageToNewMessagesCounter = createAction('[Chat] Add New Message To Counter');
export const decreaseMessagesCounter = createAction('[Chat] Decrease New Message Counter', props<{ decreaseNumber: number }>());
