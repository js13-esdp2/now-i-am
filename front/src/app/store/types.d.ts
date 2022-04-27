import { EditUserError, LoginError, RegisterError, User } from '../models/user.model';
import { Post, PostModalData } from '../models/post.model';


export type UsersState = {
  user: null | User,
  registerLoading: boolean,
  registerError: null | RegisterError,
  editLoading: boolean,
  editError: null | EditUserError,
  loginLoading: boolean,
  loginError: null | LoginError,
}

export type PostState = {
  post: null | Post,
  postModalData: PostModalData,
  posts: Post[],
  fetchLoading: boolean,
  fetchError: null | string,
  createLoading: boolean,
  createError: null | string,
}

export type SearchState = {
  users: null | User[],
  searchData: string,
  searchLoading: boolean,
  searchError: null | string,
}

export type AppState = {
  users: UsersState,
  posts: PostState,
  search: SearchState,
}
