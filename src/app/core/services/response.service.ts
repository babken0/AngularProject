import {Injectable} from '@angular/core';
import {ProjectModel} from "../models/project.model";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs/operators";

@Injectable()
export class ResponseService {

  constructor(private http: HttpClient) {
  }

  getResponseObservable(): Observable<ProjectModel[]> {
    // zip(countries$, users$, statuses$, projects$).subscribe([countries, users, statuses, projects] => {
    //
    // })

    return this.http.get("../../assets/response.json")
      .pipe(map(data => data["data"] as ProjectModel[]))
  }
}
