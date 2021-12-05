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

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit,DoCheck, OnChanges,AfterViewChecked {
  @Input() formGroup!:FormGroup;
  projectList : ProjectModel[] = [];
  filterProjectList : ProjectModel[] = [];
  //@ViewChild("selectStatus") selectStatus!:HTMLSelectElement;
  selectedStatusId: number = 0;


  constructor(
    private responseService :ResponseService,
    private countryService :CountryService,
    private statusService: StatusService,
    private projectService:ProjectService,
  ) {
  }

  ngOnInit(): void {
    this.filterProjectList  = this.projectList;
  }


  ngDoCheck(): void {
    // console.log("doCheck")

    this.initResponseData();
    this.filterByStatusId(this.selectedStatusId)

  }


  ngAfterViewChecked(): void {
    //console.log(this.selectStatus.value);
  }




  initResponseData() {
    this.projectService.getProjects$().subscribe( pr => this.projectList = this.filterProjectList = pr);
  }

  getCountryById(id:number){
    return this.countryService.getCountryById(id)?.name[3];
  }

  getStatusById(id:number){
    return this.statusService.getStatusById(id)?.name[3]
  }

  getDataStatuses():number[]{
    let statuses = this.projectList.map(data => data.workflowStateId);
    return statuses.filter((c, index) => {
      return statuses.indexOf(c) === index;
    });
  }

  filterByStatusId(statusId:number){
    console.log(statusId)
    if (statusId == 0){
      this.filterProjectList = this.projectList
    }
    else {
      console.log("filterByStatusId")
      this.filterProjectList = this.projectList.filter(project => project.workflowStateId == statusId);
    }
    console.log(this.filterProjectList)
  }

  ngOnChanges(changes: SimpleChanges): void {


  }
  onChange(event:any){
    this.selectedStatusId = +event.target.value;

  }



}
