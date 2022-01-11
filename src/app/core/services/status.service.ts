import {Injectable} from '@angular/core';
import {Status} from "../models/status.model";
import {map, shareReplay} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";


@Injectable()
export class StatusService {
  statuses$ !: Observable<Status[]>

  constructor(private http: HttpClient) {
    this.statuses$ = this.http.get("../../assets/WorkflowStates.json")
      .pipe(map(statuses => statuses["data"] as Status[]),
        shareReplay({bufferSize: 1, refCount: true}))
  }

  getStatuses(): Observable<Status[]> {
    return this.statuses$;
  }

  getStatusById(statusID: number): Observable<Status> {
    return <Observable<Status>>this.getStatuses()
      .pipe(map(statuses => statuses.find(status => status.WFSTATEID == statusID)))
  }

}
