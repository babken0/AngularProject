import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,

} from '@angular/core';
import {ProjectService} from "../services/project.service";
import {ProjectModel} from "../models/project.model";
import {CountryService} from "../services/country.service";
import {StatusService} from "../services/status.service";
import {UserService} from "../services/user.service";
import {SearchModel} from "../models/search.model";

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit, OnChanges {
  @Input() searchData!: SearchModel;
  projects: ProjectModel[] = [];
  filteredProjects: ProjectModel[] = [];
  selectedStatusId: number = 0;
  projectsFilteredBySearch: ProjectModel[] = [];
  count: number = 0;
  previousSort: string = "";
  color: string= 'white';

  constructor(private responseService: ProjectService,
              private countryService: CountryService,
              private statusService: StatusService,
              private userService: UserService) {
  }

  ngOnInit(): void {
    this.getAllProject()
  }

  private getAllProject() {
    return this.responseService.getProjectObservable()
      .subscribe(data => {
        this.projects = data;
        this.filteredProjects = this.projects;
        this.projectsFilteredBySearch = this.filteredProjects;
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.filterAll();
  }

  getCountryName(id: number) {
    return this.countryService.getCountryById(id)?.name[3];
  }

  getStatusName(id: number) {
    return this.statusService.getStatusById(id)?.name[3]
  }

  getStatusIdes(): number[] {
    const statuses = this.projectsFilteredBySearch.map(data => data.workflowStateId);

    return statuses.filter((c, index) => statuses.indexOf(c) === index);
  }

  filterAll(): void {
    if (this.searchData) {
      this.doFilterByCountryId(this.searchData?.countryId);
      this.doFilterKeyword();
      this.projectsFilteredBySearch = this.filteredProjects;
      this.filterByStatusId(this.selectedStatusId)
      this.filterByStartDate()
    } else {
      this.filteredProjects = this.projects;
      this.projectsFilteredBySearch = this.projects;
      this.filterByStatusId(this.selectedStatusId)
    }
  }

  filterByStatusId(statusId: number): void {
    if (statusId == 0) {
      this.filteredProjects = this.projectsFilteredBySearch
    } else {
      this.filteredProjects = this.projectsFilteredBySearch.filter(project => project.workflowStateId == statusId);
    }
  }

  private doFilterByCountryId(countryId: number): void {
    if (countryId === 0) {
      this.filteredProjects = this.projects
    } else {
      this.filteredProjects = this.projects.filter(project => project.InterventionCountryID == countryId);
    }
  }

  doFilterKeyword(): void {
    let keyword = this.searchData?.keyword;
    const isCodeOfIntervention = this.searchData?.codeOfIntervention;
    const isTitleOfIntervention = this.searchData?.titleOfIntervention;
    const isInterventionShortName = this.searchData?.interventionShortName;
    const isInterventionDescription = this.searchData?.interventionDescription;
    const canFilter = keyword != "" && (isCodeOfIntervention || isTitleOfIntervention || isInterventionShortName || isInterventionDescription);

    if (canFilter) {
      keyword = keyword.toUpperCase();
      this.filteredProjects = this.filterByKeyword(keyword, isCodeOfIntervention, isTitleOfIntervention, isInterventionShortName, isInterventionDescription)
    }
  }

  private filterByKeyword(keyword: string, isCode: boolean, isTitle: boolean, isShortName: boolean, isDescription: boolean): ProjectModel[] {
    return (this.filteredProjects.filter(project => {
      return ContentComponent.containsCode(keyword, isCode, project) ||
        ContentComponent.containsTitle(keyword, isTitle, project) ||
        ContentComponent.containsShortName(keyword, isShortName, project) ||
        ContentComponent.containsDescription(keyword, isDescription, project)
    }));
  }

  filterByStartDate(): void {
    const fromInt = new Date(this.searchData?.startDateFrom | 0).getTime()
    let toInt = Infinity

    if (this.searchData?.startDateTo) {
      toInt = new Date(this.searchData?.startDateTo).getTime();
    }

    this.filteredProjects = this.filteredProjects.filter(data => {
        const startDate = new Date(data.ActualStartDate).getTime();
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
        this.filteredProjects = this.filteredProjects
          .sort((a, b) => {
            return (a.InterventionCode?.localeCompare(b.InterventionCode)) * sortType;
          });
        break;
      case "ShortName":
        this.filteredProjects = this.filteredProjects
          .sort((a, b) => {
            return (a.ShortName?.localeCompare(b.ShortName)) * sortType;
          });
        break;
      case "Title":
        this.filteredProjects = this.filteredProjects
          .sort((a, b) => {
            return (a.Title?.localeCompare(b.Title)) * sortType;
          });
        break;
      case "InterventionCountryID":
        this.filteredProjects = this.filteredProjects
          .sort((a, b) => {
            return (this.countryService.getCountryById(a.InterventionCountryID)?.name["3"]?.localeCompare(this.countryService.getCountryById(b.InterventionCountryID)?.name["3"]) * sortType);
          });
        break;
      case "workflowStateId":
        console.log("sort by Status")
        this.filteredProjects = this.filteredProjects
          .sort((a, b) => {
            return this.statusService.getStatusById(a.workflowStateId).name["3"].localeCompare((this.statusService.getStatusById(b.workflowStateId).name["3"])) * sortType;
          });
        break;
      case "UpdatedUserID":
        this.filteredProjects = this.filteredProjects
          .sort((a, b) => {
            return (this.userService.getUserById(a.UpdatedUserID)?.name["3"]?.localeCompare(this.userService.getUserById(b.UpdatedUserID)?.name["3"])) * sortType;
          });
        break;
      case "DateUpdated":
        this.filteredProjects = this.filteredProjects
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


  private static containsCode(keyword: string, isChecked: boolean, project: ProjectModel) {
    return isChecked ? project?.InterventionCode?.toUpperCase()?.includes(keyword) : false;
  }

  private static containsTitle(keyword: string, isChecked: boolean, project: ProjectModel) {
    return isChecked ? project?.Title?.toUpperCase()?.includes(keyword) : false;
  }

  private static containsShortName(keyword: string, isChecked: boolean, project: ProjectModel) {
    return isChecked ? project?.ShortName?.toUpperCase()?.includes(keyword) : false;
  }

  private static containsDescription(keyword: string, isChecked: boolean, project: ProjectModel) {
    return isChecked ? project?.Description?.toUpperCase()?.includes(keyword) : false;
  }
}
