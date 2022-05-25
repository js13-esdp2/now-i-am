import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment as env } from '../../environments/environment';
import {
  ApiCountryData,
  EditUserData,
  LoginUserData,
  PasswordData,
  RecoveryData,
  RegisterUserData,
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
  ) {
  }

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
    return this.http.get<ApiCountryData[]>(env.apiUrlCountries).pipe(
      map(response => {
        let array = Object.values(response);
        return getCitiesArray(array[2]);
      })
    );
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

  getUser(id: string) {
    return this.http.get<User>(env.apiUrl + '/users/' + id);
  }

  addFriend(userId: string) {
    return this.http.post<Friends[]>(env.apiUrl + '/friends', {userId});
  }

  getFriends() {
    return this.http.get<Friends[]>(env.apiUrl + '/friends').pipe(
      map(response => {
        return response.map(friendsData => {
          return new Friends(
            friendsData._id,
            friendsData.user,
            friendsData.friend,
            friendsData.isFriend,
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
    return this.http.post<User>(env.apiUrl + '/users/changePassword', passwords);
  }
}

const getCitiesArray = (array: any) => {
  let arrayData = [];
  for (let i = 0; i <= array.length -1; i++) {
    arrayData.push(array[i]);
  }
  return arrayData;
}
