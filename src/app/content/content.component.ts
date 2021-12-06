import {
  AfterViewChecked,
  Component,
  DoCheck,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {ResponseService} from "../services/response.service";
import {ProjectModel} from "../models/Project.model";
import {CountryService} from "../services/country.service";
import {CountryModel} from "../models/Country.model";
import {StatusService} from "../services/status.service";
import {UserService} from "../services/user.service";
import {FormGroup} from "@angular/forms";
import {ProjectService} from "../services/project.service";
import {SearchModel} from "../models/Search.model";

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit,DoCheck, OnChanges,AfterViewChecked {
  @Input() searchData!:SearchModel;
  projectList : ProjectModel[] = [];
  filterProjectList : ProjectModel[] = [];
  selectedStatusId: number = 0;
  statusList:ProjectModel[] = [];


  constructor(
    private responseService :ResponseService,
    private countryService :CountryService,
    private statusService: StatusService,
    private projectService:ProjectService,
  ) {
  }

  ngOnInit(): void {
    this.projectList = this.getResponseData();
    this.filterProjectList  = this.projectList;
    this.statusList = this.filterProjectList;

  }


  ngOnChanges(changes: SimpleChanges): void {
    if (this.searchData) {
      this.filterAll();
    }

  }

  ngDoCheck(): void {

  }


  ngAfterViewChecked(): void {
    //console.log(this.selectStatus.value);
  }




  getResponseData() {
    return this.responseService.getAllResponseData();
  }

  getCountryById(id:number){
    return this.countryService.getCountryById(id)?.name[3];
  }

  getStatusById(id:number){
    return this.statusService.getStatusById(id)?.name[3]
  }

  getDataStatuses():number[]{
    // if(this.searchData){
    //   this.filterAll();
    // }

    let statuses = this.statusList.map(data => data.workflowStateId);
    return statuses.filter((c, index) => {
      return statuses.indexOf(c) === index;
    });
  }

  filterByStatusId(statusId:number){
      if(statusId!=0){
      this.filterProjectList = this.statusList.filter(project => project.workflowStateId == statusId);}
      else{
        this.filterProjectList = this.statusList
      }
      console.log(this.filterProjectList)

  }

  filterByCountryId(countryId: number) {

    if (countryId == 0) {
      this.filterProjectList = this.projectList
    } else {
     this.filterProjectList = this.projectList.filter(project => project.InterventionCountryID == countryId);
    }
  }

  filterAll() {
      this.filterByCountryId(this.searchData?.countryId);
    this.keywordFilter();
    this.statusList = this.filterProjectList;
    this.filterByStatusId(this.selectedStatusId)
  }

  keywordFilter() {
    let keyword = this.searchData?.keyword;
    let keywordFilterProjectList: ProjectModel[] = [];
    if (keyword != "" && !(
      !this.searchData?.codeOfIntervention &&
      !this.searchData?.titleOfIntervention &&
      !this.searchData?.interventionShortName &&
      !this.searchData?.interventionDescription
    ) ) {
      keyword = keyword?.toUpperCase();
      keywordFilterProjectList.push(...this.filterByCodeOfTheIntervention(keyword));
      keywordFilterProjectList.push(...this.filterByTitleOfTheIntervention(keyword));
      keywordFilterProjectList.push(...this.filterByInterventionShortName(keyword));
      keywordFilterProjectList.push(...this.filterByInterventionDescription(keyword));

      this.filterProjectList = keywordFilterProjectList.filter((c, index) => {
        return keywordFilterProjectList.indexOf(c) === index;
      });
    }

  }

  filterByCodeOfTheIntervention(keyword: string) {
    if (this.searchData?.codeOfIntervention) {
      return  this.filterProjectList.filter(code => code.InterventionCode?.toUpperCase()?.includes(keyword))
    }
    return []
  }

  filterByTitleOfTheIntervention(keyword: string) {
    if (this.searchData?.titleOfIntervention) {
      return  this.filterProjectList.filter(code => code.Title?.toUpperCase()?.includes(keyword))
    }
    return []
  }

  filterByInterventionShortName(keyword: string) {
    if (this.searchData?.interventionShortName) {
      return  this.filterProjectList.filter(code => code.ShortName?.toUpperCase()?.includes(keyword))
    }
    return []
  }

  filterByInterventionDescription(keyword: string) {
    if (this.searchData?.interventionDescription) {
      return  this.filterProjectList.filter(code => code?.Description?.toUpperCase()?.includes(keyword))
    }
    return []
  }

  onChange(event:any){
    this.selectedStatusId = +event.target.value;
    this.filterByStatusId(this.selectedStatusId)
  }




}
