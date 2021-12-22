import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CountryService} from "./services/country.service";
import {ProjectService} from "./services/project.service";
import {ResponseService} from "./services/response.service";
import {StatusService} from "./services/status.service";
import {UserService} from "./services/user.service";



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers:[
    CountryService,
    ProjectService,
    ResponseService,
    StatusService,
    UserService
  ]
})
export class CoreModule { }
