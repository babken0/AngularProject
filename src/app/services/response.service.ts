import { Injectable } from '@angular/core';
import  * as response from "../../assets/response.json";

@Injectable({
  providedIn: 'root'
})
export class ResponseService {

  constructor() { }

  private getResponse(){
    return response;
  }

  getAllResponseData(){
   return  this.getResponse().data;
  }
}
