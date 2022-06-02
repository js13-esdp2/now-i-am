export class CountriesModel {
  constructor(
    public country: string,
    public cities: [{
      city: string,
    }]
  ){}
}

export interface CountriesApi {
  _id: string,
  country: string,
  cities: [{
    _id: string,
    city: string,
  }],
}
