import {Component, DoCheck, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {CountryService} from "../services/country.service";
import {CountryModel} from "../models/Country.model";
import {ResponseService} from "../services/response.service";
import {ProjectModel} from "../models/Project.model";
import {FormControl, FormGroup} from "@angular/forms";
import {ProjectService} from "../services/project.service";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit,OnChanges,DoCheck {
  countriesList :CountryModel[] = [];
  projectList:ProjectModel[] = []
  filterProjectList:ProjectModel[] = []

  public formGroup: FormGroup;

  constructor(
    private countryService:CountryService,
    private responseService:ResponseService,
    private projectService:ProjectService,
) {
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
    this.projectList = this.getResponseData()
    this.filterProjectList = this.projectList;
    this.projectService.load(this.filterProjectList);
  }

  ngOnChanges(changes: SimpleChanges): void {

    //this.formGroup.controls["search"].setValue("Search")
  }

  ngDoCheck(): void {

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

  getResponseData(){
    return this.responseService.getAllResponseData();
  }

  onSearch() {
    if (this.formGroup.controls["country"].value != 0) {
      this.filterByCountryId(this.formGroup.controls["country"].value)
    }else{
      this.filterProjectList = this.projectList
    }


    this.projectService.load(this.filterProjectList)
  }



  filterByCountryId(countryId:number){

    if (countryId == 0){
      this.filterProjectList = this.projectList
      console.log("all country")
    }
    else {
      console.log("filterByCountryId")
      this.filterProjectList = this.projectList.filter(project => project.InterventionCountryID == countryId);
    }
  }


}
