import { createAction, props } from '@ngrx/store';
import { ChatRoomData, ChatRoom } from '../../models/chatRoom.model';
import { Message } from '../../models/message.model';

export const createNewChatRoom = createAction('[Chat] Post Request', props<{ chatRoomData: ChatRoomData }>());
export const createNewChatRoomSuccess = createAction('[Chat] Post Success');
export const createNewChatRoomFailure = createAction('[Chat] Post Failure', props<{ error: string }>());

export const getUsersChatRooms = createAction('[Chat] Fetch Request', props<{ userId: string | undefined }>());
export const getUsersChatRoomsSuccess = createAction('[Chat] Fetch Success', props<{ chatRooms: ChatRoom[] }>());
export const getUsersChatRoomsFailure = createAction('[Chat] Fetch Failure', props<{ error: string }>());

export const changeChatRoom = createAction('[Chat] Change Chat', props<{chatRoom: ChatRoom}>());
export const addNewMessageToChatRoom = createAction('[Chat] Add Message', props<{newMessage: Message}>());
