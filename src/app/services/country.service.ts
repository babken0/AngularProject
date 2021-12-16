import {Injectable} from '@angular/core';
import * as countries from "../../assets/Countries.json";
import {OuntryModel} from "../models/ountry.model";

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  constructor() {
  }

  private getCountries() {
    return countries;
  }

  getCountriesData(): OuntryModel[] {
    return this.getCountries().data;
  }

  getCountryById(countryID: number): OuntryModel {
    return <OuntryModel>this.getCountries().data.find(country => country.CountryId == countryID)
  }
}
