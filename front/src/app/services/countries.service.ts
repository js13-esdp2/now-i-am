import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Countries } from '../models/user.model';


@Injectable({
  providedIn: 'root'
})

export class CountriesService {
  constructor(
    private http: HttpClient,
  ){}

  getCountries(){
    return this.http.get<Countries[]>(environment.apiUrl + '/countries');
  }
}
