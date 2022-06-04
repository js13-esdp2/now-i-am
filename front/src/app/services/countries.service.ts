import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CountriesModel } from '../models/countries.model';


@Injectable({
  providedIn: 'root'
})

export class CountriesService {
  constructor(
    private http: HttpClient,
  ){}

  getCountries(){
    return this.http.get<CountriesModel[]>(environment.apiUrl + '/countries');
  }
}
