import {AfterViewInit, Component, Input, ViewChild} from '@angular/core';

import {CountryService} from "./services/country.service";
import {SearchComponent} from "./search/search.component";
import {FormGroup} from "@angular/forms";
import {SearchModel} from "./models/Search.model";



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

   form!: FormGroup
   searchData!: SearchModel


  constructor(private countryService:CountryService) {

  }

  getSearchData(search:SearchModel){
     this.searchData = search;
  }




}
