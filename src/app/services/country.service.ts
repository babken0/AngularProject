import {Injectable} from '@angular/core';
import * as countries from "../../assets/Countries.json";
import {CountryModel} from "../models/Country.model";

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  constructor() {
  }

  private getCountries() {
    return countries;
  }

  getCountriesData(): CountryModel[] {
    return this.getCountries().data;
  }

  getCountryById(countryID:number){
    return this.getCountries().data.find(country=> country.CountryId==countryID)
  }
}
