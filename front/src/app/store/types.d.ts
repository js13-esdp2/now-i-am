import { EditUserError, LoginError, RecoveryData, RegisterError, User } from '../models/user.model';
import { Post, PostModalData } from '../models/post.model';
import { ChatRoom } from '../models/chatRoom.model';
import { Friends } from '../models/frends.model';
import { CountriesModel } from '../models/countries.model';


export type UsersState = {
  user: null | User,
  friend: null | User,
  recoveryData: null | RecoveryData,
  friends: Friends[],
  registerLoading: boolean,
  registerError: null | RegisterError,
  editLoading: boolean,
  editError: null | EditUserError,
  loginLoading: boolean,
  loginError: null | LoginError,
  addFriendLoading: boolean,
  addFriendError: null | string,
  fetchFriendsLoading: boolean,
  fetchFriendsError: null | string,
  fetchUserLoading: boolean,
  fetchUserError: null | string,
  fetchLoading: boolean,
  fetchError: null | string,
  fetchPasswordLoading: boolean,
  fetchPasswordError: null | LoginError,
  checkCodeLoading: boolean,
  checkCodeError: null | LoginError,
  removeFriendLoading: boolean,
  removeFriendError: null | string,
  changePasswordLoading: boolean,
  changePasswordError: null | string,
}

export type PostState = {
  post: null | Post,
  postModalData: PostModalData,
  posts: Post[],
  createLoading: boolean,
  createError: null | string,
  likeLoading: boolean,
  likeError: null | string,
  fetchLoading: boolean,
  fetchError: null | string,
}

export type SearchState = {
  users: null | User[],
  searchData: string,
  searchLoading: boolean,
  searchError: null | string,
  fetchLoading: boolean,
  fetchError: null | string,
}

export type ChatState = {
  chatRoom: undefined | null | ChatRoom,
  chatRooms: ChatRoom[],
  fetchLoading: boolean,
  fetchError: null | string,
  createLoading: boolean,
  createError: null | string,
  deleteLoading: boolean,
  deleteError: null | string,
}

export type CountriesState = {
  countries: CountriesModel[];
  fetchError: null | string,
}


export type AppState = {
  users: UsersState,
  posts: PostState,
  search: SearchState,
  chat: ChatState,
  countries: CountriesState,
}
