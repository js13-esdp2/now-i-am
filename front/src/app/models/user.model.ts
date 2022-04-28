export interface User {
  _id: string;
  email: string;
  displayName: string;
  token: string;
  photo?: string;
  age?: number;
  sex?: string;
  country?: string;
  city?: string;
  aboutMe?: string;
  isPrivate?: boolean;
  role: string;
  friendRequests: {
    _id: string;
    user: string;
  }[]
}

export interface RegisterUserData {
  email: string;
  password: string;
  displayName: string;
}

export interface EditUserData {
  [key: string]: any;
  photo: string;
  displayName: string;
  age: number;
  sex: string;
  country?: string;
  city?: string;
  aboutMe?: string;
  isPrivate?: boolean;
}

export interface LoginUserData {
  email: string;
  password: string;
}

export interface FieldError {
  message: string;
}

export interface RegisterError {
  errors: {
    email?: undefined | FieldError;
    password?: undefined | FieldError;
    displayName?: undefined | FieldError;
  }
}

export interface EditUserError {
  errors: {
    photo?: undefined | FieldError;
    displayName?: undefined | FieldError;
    age?: undefined | FieldError;
    sex?: undefined | FieldError;
    country?: undefined | FieldError;
    city?: undefined | FieldError;
    aboutMe?: undefined | FieldError;
    isPrivate?: undefined | FieldError;
  }
}

export interface LoginError {
  error: string;
}
