import {Injectable} from '@angular/core';
import {CountryModel} from "../models/country.model";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs/operators";
import {ProjectModel} from "../models/project.model";
import {forkJoin} from "rxjs";
import {of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  countries!: CountryModel[];

  constructor(private http: HttpClient) {
  }

  getCountriesObservable(): Observable<CountryModel[]> {
    if (this.countries) {
      return of(this.countries)
    } else {
      return this.http.get("../../assets/Countries.json")
        .pipe(map(data => {
          this.countries = data["data"] as CountryModel[];
          return  data["data"] as CountryModel[];
        }))
    }
  }

  getCountryById(countryID: number): Observable<CountryModel> {
    return <Observable<CountryModel>>this.getCountriesObservable()
      .pipe(map(counties => counties.find(country => country.CountryId == countryID)))
  }

  getProjectsCountry(projectsObservable: Observable<ProjectModel[]>): Observable<CountryModel[]> {
    const countriesObservable = this.getCountriesObservable();
    return forkJoin([
      projectsObservable, countriesObservable])
      .pipe(map(([projects, countries]) => {
          return <CountryModel[]>projects.map(project => countries.find(country => country.CountryId == project.InterventionCountryID))
        })
      )
  }
}
