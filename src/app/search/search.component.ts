import {Component, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {CountryService} from "../services/country.service";
import {AbstractControl, FormControl, FormGroup} from "@angular/forms";
import {CountryModel} from "../models/Country.model";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit,OnChanges {
  countriesList :CountryModel[] = [];

  public formGroup: FormGroup;

  constructor(private countryService:CountryService) {
    this.countriesList = this.getCountries();
    this.formGroup = this.createFormGroup()
    //console.log(this.formGroup.controls["keyword"])
  }



  getCountriesName(){
    return this.countryService.getCountriesData().map(data => data.name[3])
  }

  getCountries(){
    return this.countryService.getCountriesData();
  }
  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.formGroup.controls);
  }


  private createFormGroup(){
    return  new FormGroup(
      {
        country: new FormControl(""),
        keyword: new FormControl(""),
        codeOfIntervention: new FormControl(""),
        titleOfIntervention: new FormControl(""),
        interventionShortName: new FormControl(""),
        interventionDescription: new FormControl(""),
        startDateFrom: new FormControl(""),
        startDateTo: new FormControl(""),
      }
    );

  }


}
