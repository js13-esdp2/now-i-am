export class CountriesModel {
  constructor(
    public country: string,
    public cities: [{
      city: string,
    }]
  ){}
}

export interface CountriesApi {
  [key: string]: any,
  country: string,
  cities: [{
    [key: string]: any,
    city: string,
  }],
}

export interface City {
  [key: string]: any,
  city: string,
}
