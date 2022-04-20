import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
import { environment as env } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private http: HttpClient) {}


  searchUsers(searchData: string) {
    return this.http.post<User[]>(env.apiUrl + '/search', searchData);
  }
}
