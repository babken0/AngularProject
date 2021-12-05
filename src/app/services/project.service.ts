import { Injectable } from '@angular/core';
import {ProjectModel} from "../models/Project.model";
import {of,Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor() { }
  private ob = new Observable<ProjectModel[]>();

  load(list: ProjectModel[]) {
    this.ob= of(list);
  }

  getProjects$(): Observable<ProjectModel[]> {
    return this.ob;
  }
}
