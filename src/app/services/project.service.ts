import {Injectable} from '@angular/core';
import * as response from "../../assets/response.json";
import {ProjectModel} from "../models/project.model";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {map, zip} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private http: HttpClient) {
  }


  getProjectObservable(): Observable<ProjectModel[]> {
    // zip(countries$, users$, statuses$, projects$).subscribe([countries, users, statuses, projects] => {
    //
    // })

    return this.http.get("../../assets/response.json")
      .pipe(map(data => data["data"] as ProjectModel[]))
  }


}
