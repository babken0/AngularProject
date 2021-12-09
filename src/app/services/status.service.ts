import {Injectable} from '@angular/core';
import * as states from "../../assets/WorkflowStates.json";
import {Status} from "../models/status.model";

@Injectable({
  providedIn: 'root'
})
export class StatusService {

  constructor() {
  }

  private getStates() {
    return states
  }

  getStatusById(statusID: number): Status {
    return <Status>this.getStates().data.find(state => state.WFSTATEID == statusID)
  }
}
