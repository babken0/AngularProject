import {Injectable} from '@angular/core';
import {CountryModel} from "../models/country.model";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs/operators";
import {ProjectModel} from "../models/project.model";

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  constructor(private http:HttpClient) {
  }


  getCountriesObservable(): Observable<CountryModel[]> {
    return this.http.get("../../assets/Countries.json")
      .pipe(map(data => data["data"] as CountryModel[] ))
  }

  getCountryById(countryID: number): CountryModel {
    return <CountryModel>this.getCountries().data.find(country => country.CountryId == countryID)
  }
}
