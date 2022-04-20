import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment as env } from '../../environments/environment';
import { EditUserData, LoginUserData, RegisterUserData, User } from '../models/user.model';

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

  logout() {
    return this.http.delete(env.apiUrl + '/users/sessions');
  }

}
