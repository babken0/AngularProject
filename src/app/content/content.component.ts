import { Component, OnInit } from '@angular/core';
import {ResponseService} from "../services/response.service";
import {ProjectModel} from "../models/Project.model";
import {CountryService} from "../services/country.service";
import {CountryModel} from "../models/Country.model";
import {StatusService} from "../services/status.service";
import {UserService} from "../services/user.service";

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {

  constructor(
    private responseService :ResponseService,
    private countryService :CountryService,
    private statusService: StatusService,
    private userService:UserService,
  ) {
  }

  ngOnInit(): void {
  }

  getResponseData(): ProjectModel[]{
    return this.responseService.getAllResponseData();
  }

  getCountryById(id:number){
    return this.countryService.getCountryById(id)?.name[3];
  }

  getStatusById(id:number){
    return this.statusService.getStatusById(id)?.name[3]
  }

  getUserById(id:number){
    return this.userService.getUserById(id)?.name[3];
  }


}
