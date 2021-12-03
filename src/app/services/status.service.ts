import {Injectable} from '@angular/core';
import * as states from "../../assets/WorkflowStates.json";

@Injectable({
  providedIn: 'root'
})
export class StatusService {

  constructor() {
  }

  private getStates() {
    return states
  }

  getAllStatesData() {
    return this.getStates().data;
  }

  getStatusById(statusID: number) {
    return this.getStates().data.find(state => state.WFSTATEID == statusID)
  }
}
