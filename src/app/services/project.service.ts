import { Injectable } from '@angular/core';
import  * as response from "../../assets/response.json";
import {ProjectModel} from "../models/project.model";

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor() { }

  private getProject(){
    return response;
  }

  getAllProjectData():ProjectModel[]{
   return <ProjectModel[]>this.getProject().data;
  }
}
