import {Injectable} from '@angular/core';
import {Status} from "../models/status.model";
import {map, shareReplay} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";
import {forkJoin, Observable,of} from "rxjs";
import {ProjectModel} from "../models/project.model";



@Injectable()
export class StatusService {
  statuses$ !:Observable<Status[]>

  constructor(private http: HttpClient) {
    this.statuses$ = this.http.get("../../assets/WorkflowStates.json")
      .pipe(map(statuses => statuses["data"] as Status[]),
    shareReplay({bufferSize:1,refCount:true}))
  }

  private getStatuses(): Observable<Status[]> {
    return this.statuses$;
  }

  getStatusById(statusID: number): Observable<Status> {
    return <Observable<Status>>this.getStatuses()
      .pipe(map(statuses => statuses.find(status => status.WFSTATEID == statusID)))
  }

  getProjectsStatus(projects$: Observable<ProjectModel[]>): Observable<Status[]> {
    const statuses$ = this.getStatuses();
    return forkJoin([projects$, statuses$])
      .pipe(map(([projects, statuses]) => {
          return <Status[]> projects.map(project => statuses.find(status => status.WFSTATEID == project.workflowStateId))
        })
      )
  }
}
