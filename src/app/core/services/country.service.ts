import {Injectable} from '@angular/core';
import {CountryModel} from "../models/country.model";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {map, shareReplay} from "rxjs/operators";

@Injectable()
export class CountryService {
  countries$!: Observable<CountryModel[]>;

  constructor(private http: HttpClient) {
    this.countries$ = this.http.get("../../assets/Countries.json")
      .pipe(map(data => data["data"] as CountryModel[]), shareReplay({bufferSize: 1, refCount: true}))
  }

  getCountries(): Observable<CountryModel[]> {
    return this.countries$
  }

  getCountryById(countryID: number): Observable<CountryModel> {
    return <Observable<CountryModel>>this.getCountries()
      .pipe(map(counties => counties.find(country => country.CountryId == countryID)))
  }

}
