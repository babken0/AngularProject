import { Injectable } from '@angular/core';
import  * as response from "../../assets/response.json";
import {ProjectModel} from "../models/Project.model"

@Injectable({
  providedIn: 'root'
})
export class ResponseService {

  constructor() { }

  private getResponse(){
    return response;
  }

  getAllResponseData():ProjectModel[]{
   return <ProjectModel[]>this.getResponse().data;
  }
}
