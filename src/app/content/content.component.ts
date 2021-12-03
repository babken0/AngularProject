import { Component, OnInit } from '@angular/core';
import {ResponseService} from "../services/response.service";

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {

  constructor(private response :ResponseService) {
    //this.responseData = response.getAllResponseData()
  }

  ngOnInit(): void {
  }

  getResponseData(){
    return this.response.getAllResponseData();
  }
  convertToDate(val:number){

    return new Date (val).toLocaleDateString();

  }

}
