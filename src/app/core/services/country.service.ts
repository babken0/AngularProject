import {Injectable} from '@angular/core';
import {CountryModel} from "../models/country.model";
import {forkJoin, Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {map, shareReplay} from "rxjs/operators";
import {ProjectModel} from "../models/project.model";

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

  getProjectsCountry(projects$: Observable<ProjectModel[]>): Observable<CountryModel[]> {
    const countries$ = this.getCountries();
    return forkJoin([projects$, countries$])
      .pipe(map(([projects, countries]) => {
          return <CountryModel[]>projects.map(project => countries.find(country => country.CountryId == project.InterventionCountryID))
        })
      )
  }
}
