import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,

} from '@angular/core';
import {ProjectService} from "../services/project.service";
import {ProjectModel} from "../models/Project.model";
import {CountryService} from "../services/country.service";
import {StatusService} from "../services/status.service";
import {UserService} from "../services/user.service";
import {SearchModel} from "../models/Search.model";

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit, OnChanges {
  @Input() search!: SearchModel;
  projectList: ProjectModel[] = [];
  filterProjectList: ProjectModel[] = [];
  selectedStatusId: number = 0;
  statusList: ProjectModel[] = [];
  count: number = 0;
  previousSort: string = "";


  constructor(private responseService: ProjectService,
              private countryService: CountryService,
              private statusService: StatusService,
              private userService: UserService) {
  }

  ngOnInit(): void {
    this.projectList = this.responseService.getAllProjectData();
    this.filterProjectList = this.projectList;
    this.statusList = this.filterProjectList;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.filterAll();
  }

  getCountryById(id: number) {
    return this.countryService.getCountryById(id)?.name[3];
  }

  getStatusById(id: number) {
    return this.statusService.getStatusById(id)?.name[3]
  }

  getDataStatuses(): number[] {
    let statuses = this.statusList.map(data => data.workflowStateId);
    return statuses.filter((c, index) => {
      return statuses.indexOf(c) === index;
    });
  }

  filterAll(): void {
    if (this.search) {
      this.filterByCountryId(this.search?.countryId);
      this.keywordFilter();
      this.statusList = this.filterProjectList;
      this.filterByStatusId(this.selectedStatusId)
      this.filterByStartDate()
    } else {
      this.filterProjectList = this.projectList;
      this.statusList = this.projectList;
      this.filterByStatusId(this.selectedStatusId)
    }
  }

  filterByStatusId(statusId: number): void {
    if (statusId != 0) {
      this.filterProjectList = this.statusList.filter(project => project.workflowStateId == statusId);
    } else {
      this.filterProjectList = this.statusList
    }
  }

  filterByCountryId(countryId: number): void {
    if (countryId == 0) {
      this.filterProjectList = this.projectList
    } else {
      this.filterProjectList = this.projectList.filter(project => project.InterventionCountryID == countryId);
    }
  }

  keywordFilter(): void {
    let keyword = this.search?.keyword;
    let isCodeOfIntervention = this.search?.codeOfIntervention;
    let isTitleOfIntervention = this.search?.titleOfIntervention;
    let isInterventionShortName = this.search?.interventionShortName;
    let isInterventionDescription = this.search?.interventionDescription;
    if (keyword != "" && !(
      !isCodeOfIntervention &&
      !isTitleOfIntervention &&
      !isInterventionShortName &&
      !isInterventionDescription
    )) {
      // TODO: poxel ushi mas@
      keyword = keyword?.toUpperCase();
      this.filterProjectList = this.filterByKeyword(keyword, isCodeOfIntervention, isTitleOfIntervention, isInterventionShortName, isInterventionDescription)
    }
  }


  private filterByKeyword(keyword: string, isCode: boolean, isTitle: boolean, isShortName: boolean, isDescription: boolean): ProjectModel[] {
    return (this.filterProjectList.filter(code => {
      return ContentComponent.filterByInterventionCode(keyword,isCode,code) ||
        ContentComponent.filterByTitle(keyword,isTitle,code) ||
        ContentComponent.filterByShortName(keyword,isShortName,code) ||
        ContentComponent.filterByDescription(keyword,isDescription,code)
    }));
  }

  private static filterByInterventionCode(keyword:string, isChecked:boolean, project:ProjectModel){
    return  isChecked ? project?.InterventionCode?.toUpperCase()?.includes(keyword) : false;
  }
   private static filterByTitle(keyword:string, isChecked:boolean, project:ProjectModel){
    return  isChecked ? project?.Title?.toUpperCase()?.includes(keyword) : false;
  }

  private static filterByShortName(keyword:string, isChecked:boolean, project:ProjectModel){
    return  isChecked ? project?.ShortName?.toUpperCase()?.includes(keyword) : false;
  }

  private static filterByDescription(keyword:string, isChecked:boolean, project:ProjectModel){
    return  isChecked ? project?.Description?.toUpperCase()?.includes(keyword) : false;
  }



  filterByStartDate(): void {
    let fromInt = new Date(this.search?.startDateFrom | 0).getTime()
    let toInt = Infinity
    if (this.search?.startDateTo) {
      toInt = new Date(this.search?.startDateTo).getTime();
    }
    this.filterProjectList = this.filterProjectList.filter(data => {
        let startDate = new Date(data.ActualStartDate).getTime();
        return (startDate > fromInt && startDate < toInt)
      }
    )
  }

  sortData(sortBy: string): void {
    if (this.previousSort == sortBy) {
      this.count *= -1
    } else {
      this.previousSort = sortBy
      this.count = 1
    }
    let sortType = this.count
    switch (sortBy) {
      case "InterventionCode":
        this.filterProjectList = this.filterProjectList
          .sort((a, b) => {
            return (a.InterventionCode?.localeCompare(b.InterventionCode)) * sortType;
          });
        break;
      case "ShortName":
        this.filterProjectList = this.filterProjectList
          .sort((a, b) => {
            return (a.ShortName?.localeCompare(b.ShortName)) * sortType;
          });
        break;
      case "Title":
        this.filterProjectList = this.filterProjectList
          .sort((a, b) => {
            return (a.Title?.localeCompare(b.Title)) * sortType;
          });
        break;
      case "InterventionCountryID":
        this.filterProjectList = this.filterProjectList
          .sort((a, b) => {
            return (this.countryService.getCountryById(a.InterventionCountryID)?.name["3"]?.localeCompare(this.countryService.getCountryById(b.InterventionCountryID)?.name["3"]) * sortType);
          });
        break;
      case "workflowStateId":
        console.log("sort by Status")
        this.filterProjectList = this.filterProjectList
          .sort((a, b) => {
            return this.statusService.getStatusById(a.workflowStateId).name["3"].localeCompare((this.statusService.getStatusById(b.workflowStateId).name["3"])) * sortType;
          });
        break;
      case "UpdatedUserID":
        this.filterProjectList = this.filterProjectList
          .sort((a, b) => {
            return (this.userService.getUserById(a.UpdatedUserID)?.name["3"]?.localeCompare(this.userService.getUserById(b.UpdatedUserID)?.name["3"])) * sortType;
          });
        break;
      case "DateUpdated":
        this.filterProjectList = this.filterProjectList
          .sort((a, b) => {
            return (a.DateUpdated - b.DateUpdated) * sortType;
          });
        break;
    }
  }

  onStatusChange(id: string): void {
    this.selectedStatusId = +id;
    this.filterByStatusId(this.selectedStatusId)
  }


}
