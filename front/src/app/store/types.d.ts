import { ApiCountryData, City, Country, EditUserError, LoginError, RegisterError, User } from '../models/user.model';
import { Post, PostModalData } from '../models/post.model';
import { Friends } from '../models/frends.model';


export type UsersState = {
  user: null | User,
  friend: null | User,
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
  country: ApiCountryData[],
  fetchLoading: boolean,
  fetchError: null | string,
  capital: City[],
  removeFriendLoading: boolean,
  removeFriendError: null | string,
}

export type PostState = {
  post: null | Post,
  postModalData: PostModalData,
  posts: Post[],
  fetchLoading: boolean,
  fetchError: null | string,
  createLoading: boolean,
  createError: null | string,
  likeLoading: boolean,
  likeError: null | string,
}

export type SearchState = {
  users: null | User[],
  searchData: string,
  searchLoading: boolean,
  searchError: null | string,
}

export type CountryState = {
  country: Country[];
  fetchLoading: boolean,
  fetchError: null | string,
}

export type CityState = {
  capital: City[];
  fetchLoading: boolean,
  fetchError: null | string,
}

export type AppState = {
  users: UsersState,
  posts: PostState,
  search: SearchState,
  country: CountryState,
  capital: CityState,
}
