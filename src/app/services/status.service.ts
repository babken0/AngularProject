import {Injectable} from '@angular/core';
import {Status} from "../models/status.model";
import {map} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";
import {Observable,forkJoin} from "rxjs";
import {ProjectModel} from "../models/project.model";
import {CountryModel} from "../models/country.model";


@Injectable({
  providedIn: 'root'
})
export class StatusService {

  constructor(private http: HttpClient) {
  }

  private getStatusesObservable(): Observable<Status[]> {
    return this.http.get("../../assets/WorkflowStates.json")
      .pipe(map(statuses => statuses["data"] as Status[]))
  }

  getStatusById(statusID: number): Observable<Status> {
    return <Observable<Status>>this.getStatusesObservable()
      .pipe(map(statuses => statuses.find(status => status.WFSTATEID == statusID)))
  }

  getProjectsStatus(projectsObservable: Observable<ProjectModel[]>): Observable<Status[]> {
    const statusesObservable = this.getStatusesObservable();
    return forkJoin([
      projectsObservable, statusesObservable])
      .pipe(map(([projects, statuses]) => {
          return <Status[]>projects.map(project => statuses.find(status => status.WFSTATEID == project.workflowStateId))
        })
      )
  }
}
