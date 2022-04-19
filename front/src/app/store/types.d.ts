import { LoginError, RegisterError, User } from '../models/user.model';
import { Post } from '../models/post.model';


export type UsersState = {
  user: null | User,
  registerLoading: boolean,
  registerError: null | RegisterError,
  loginLoading: boolean,
  loginError: null | LoginError,
}

export type PostState = {
  post: null | Post,
  posts: Post[],
  fetchLoading: boolean,
  fetchError: null | string,
  createLoading: boolean,
  createError: null | string,
}

export  type AppState = {
  users: UsersState,
  posts: PostState,
}
