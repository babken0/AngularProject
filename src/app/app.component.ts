import {AfterViewInit, Component, Input, ViewChild} from '@angular/core';

import {CountryService} from "./services/country.service";
import {SearchComponent} from "./search/search.component";
import {FormGroup} from "@angular/forms";



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit{
   @ViewChild (SearchComponent)
   searchComponent!:SearchComponent;

   //form!: FormGroup


  constructor(private countryService:CountryService) {

  }

  ngAfterViewInit(): void {
    //this.form = this.searchComponent.formGroup;
   // console.log(this.form)
  }



}
