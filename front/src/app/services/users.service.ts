import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment as env } from '../../environments/environment';
import {
  ApiCountryData,
  EditUserData,
  LoginUserData,
  RecoveryData,
  RegisterUserData,
  PasswordData,
  User
} from '../models/user.model';
import { SocialUser } from 'angularx-social-login';
import { map } from 'rxjs';
import { Friends } from '../models/frends.model';

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

  getCountries() {
    return this.http.get<ApiCountryData[]>(env.apiUrlCountries + `/all`);
  };

  login(loginData: LoginUserData) {
    return this.http.post<User>(env.apiUrl + '/users/sessions', loginData);
  }

  loginFb(userData: SocialUser) {
    return this.http.post<User>(env.apiUrl + '/users/facebookLogin', userData);
  }

  loginGoogle(userData: SocialUser) {
    return this.http.post<User>(env.apiUrl + '/users/googleLogin', userData);
  }

  loginVK(userData: SocialUser) {
    return this.http.post<User>(env.apiUrl + '/users/vkLogin', userData);
  }

  logout() {
    return this.http.delete(env.apiUrl + '/users/sessions');
  }

  addFriend(userId: string) {
    return this.http.post<User>(env.apiUrl + '/users/addFriend', { userId });
  }

  getFriends() {
    return this.http.get<Friends[]>(env.apiUrl + '/friends').pipe(
      map(response => {
        return response.map(friendsData => {
          return new Friends(
            friendsData._id,
            friendsData.user,
            friendsData.friend,
          );
        });
      })
    );
  }

  getPassword(email: string) {
    return this.http.get<RecoveryData>(env.apiUrl + '/users/recovery/' + email);
  }

  checkCode(code: string) {
    return this.http.get(env.apiUrl + '/users/check-code/' + code);
  }


  removeFriend(id: string) {
    return this.http.delete(env.apiUrl + '/friends/' + id);
  }

  changePassword(passwords: PasswordData) {
    return this.http.post(env.apiUrl + '/users/changePassword', passwords);
  }
}
