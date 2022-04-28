import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment as env } from '../../environments/environment';
import { EditUserData, LoginUserData, RegisterUserData, User } from '../models/user.model';
import { SocialUser } from 'angularx-social-login';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(
    private http: HttpClient,
  ) {}

  register(registerData: RegisterUserData) {
    return this.http.post<User>(env.apiUrl + '/users', registerData);
  }

  edit(editData: EditUserData) {
    const formData = new FormData();
    Object.keys(editData).forEach((key) => {
      formData.append(key, editData[key]);
    });

    return this.http.post<User>(env.apiUrl + '/users/edit-profile', formData);
  }

  login(loginData: LoginUserData) {
    return this.http.post<User>(env.apiUrl + '/users/sessions', loginData);
  }


  loginFb(userData: SocialUser) {
    return this.http.post<User>(env.apiUrl + '/users/facebookLogin', userData);
  }

  loginGoogle(userData: SocialUser) {
    return this.http.post<User>(env.apiUrl + '/users/googleLogin', userData);
  }

  logout() {
    return this.http.delete(env.apiUrl + '/users/sessions');
  }

  addFriend(userId: string) {
    return this.http.post<User>(env.apiUrl + '/users/addFriend', { userId });
  }
}
