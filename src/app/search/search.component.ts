import {Component, DoCheck, EventEmitter, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {CountryService} from "../services/country.service";
import {CountryModel} from "../models/Country.model";
import {ResponseService} from "../services/response.service";
import {ProjectModel} from "../models/Project.model";
import {FormControl, FormGroup} from "@angular/forms";
import {ProjectService} from "../services/project.service";
import {SearchModel} from "../models/Search.model";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit, OnChanges, DoCheck {
  countriesList: CountryModel[] = [];
  projectList: ProjectModel[] = []
  filterProjectList: ProjectModel[] = []
  @Output() dataSearch:EventEmitter<SearchModel>

  public formGroup: FormGroup;

  constructor(
    private countryService: CountryService,
    private responseService: ResponseService,
    private projectService: ProjectService,
  ) {
    this.dataSearch = new EventEmitter<SearchModel>();
    this.countriesList = this.getCountries();
    this.formGroup = this.createFormGroup()

    //console.log(this.formGroup.controls["keyword"])
  }


  getCountriesName() {
    return this.countryService.getCountriesData().map(data => data.name[3])
  }

  getCountries() {
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

  private createFormGroup() {
    return new FormGroup(
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

  getResponseData() {
    return this.responseService.getAllResponseData();
  }

  onSearch() {

    this.dataSearch.emit(this.createSearchModel());
  }

  createSearchModel():SearchModel {
    //console.log(this.formGroup.controls["country"].value);
    return  {
      countryId: +this.formGroup.controls["country"].value,
      keyword: this.formGroup.controls["keyword"].value,
      codeOfIntervention: this.formGroup.controls["codeOfIntervention"].value,
      titleOfIntervention: this.formGroup.controls["titleOfIntervention"].value,
      interventionShortName: this.formGroup.controls["interventionShortName"].value,
      interventionDescription: this.formGroup.controls["interventionDescription"].value,
      startDateFrom: this.formGroup.controls["startDateFrom"].value,
      startDateTo: this.formGroup.controls["startDateTo"].value,
    }

  }




}
