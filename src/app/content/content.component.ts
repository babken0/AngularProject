import {Component, Input, OnInit} from '@angular/core';
import {ResponseService} from "../services/response.service";
import {ProjectModel} from "../models/Project.model";
import {CountryService} from "../services/country.service";
import {CountryModel} from "../models/Country.model";
import {StatusService} from "../services/status.service";
import {UserService} from "../services/user.service";
import {FormGroup} from "@angular/forms";

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {
  @Input() formGroup!:FormGroup

  constructor(
    private responseService :ResponseService,
    private countryService :CountryService,
    private statusService: StatusService,
  ) {
  }

  ngOnInit(): void {
    //console.log(this.formGroup.controls["country"]);
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


}
