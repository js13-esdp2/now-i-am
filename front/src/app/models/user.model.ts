export class User {
  constructor(
    public _id: string,
    public email: string,
    public displayName: string,
    public token: string,
    public role: string,
    public friendRequests: {
      _id: string;
      user: string;
    }[],
    public photo?: string,
    public birthday?: string,
    public sex?: string,
    public country?: string,
    public city?: string,
    public aboutMe?: string,
    public isPrivate?: boolean,
    public code?: string,
    public isOnLiveStream?: boolean,
  ) {
  }

  get age() {
    const dob = this.birthday;

    if (!dob) {
      return 0;
    }

    const currentDate = Date.now();
    const birthday = <any>new Date(dob);
    const difference = currentDate - birthday;
    const differenceDate = new Date(difference);
    const age = Math.abs(differenceDate.getUTCFullYear() - 1970);

    return age;
  }
}

export class RecoveryData {
  constructor(
    public code: string,
    public email: string
  ) {
  }
}

export interface RegisterUserData {
  email: string;
  password: string;
  displayName: string;
}

export interface ApiUserData {
  [key: string]: any;
  photo: string;
  displayName: string;
  birthday: string;
  sex: string;
  country?: string;
  city?: string;
  aboutMe?: string;
  isPrivate?: boolean;
  code?: string;
}

export interface EditUserData {
  [key: string]: any;
  photo: string;
  displayName: string;
  birthday: string;
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

export interface PasswordData {
  email: string,
  newPassword: string,
  currentPassword: null | string
}

