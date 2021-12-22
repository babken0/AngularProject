import {Injectable} from '@angular/core';
import {ProjectModel} from "../models/project.model";
import {HttpClient} from "@angular/common/http";
import {SearchModel} from "../models/search.model";
import {CountryModel} from "../models/country.model";
import {User} from "../models/User.model";
import {Status} from "../models/status.model";
import {CountryService} from "./country.service";
import {StatusService} from "./status.service";
import {UserService} from "./user.service";
import {ResponseService} from "./response.service";
import {Sort} from "../models/Sort.model";

@Injectable()
export class ProjectService {
  searchData!: SearchModel;
  projects!: ProjectModel[];
  projectCountries: CountryModel[] = []
  projectUsers: User[] = []
  projectStatuses: Status[] = []
  filteredProjects: ProjectModel[] = [];
  selectedStatusId: number = 0;
  projectsFilteredBySearch: ProjectModel[] = [];
  sort!: Sort

  constructor(
    private http: HttpClient,
    private countryService: CountryService,
    private statusService: StatusService,
    private userService: UserService,
    private responseService: ResponseService) {
  }


  getProjects(filterOption: SearchModel, statusId: number, sort: Sort): ProjectModel[] {
    if (!this.projects) {
      this.getAllProject();
    }
    this.getProjectsCountry();
    this.getProjectsStatus();
    this.getProjectsUser();
    this.searchData = filterOption;
    this.sort = sort
    console.log(this.searchData)
    this.selectedStatusId = statusId;
    this.filterAll();
    this.sortData();
    return this.filteredProjects
  }


  getStatusName(id: number) {
    return this.getStatusById(id)?.name[3]
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
      return ProjectService.containsCode(keyword, isCode, project) ||
        ProjectService.containsTitle(keyword, isTitle, project) ||
        ProjectService.containsShortName(keyword, isShortName, project) ||
        ProjectService.containsDescription(keyword, isDescription, project)
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

  sortData(): void {
    let sortBy = this.sort?.name
    let sortType = this.sort?.option
    console.log(sortBy, sortType)
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

            return ((this.getCountryById(a.InterventionCountryID)?.name["3"])?.localeCompare(this.getCountryById(b.InterventionCountryID)?.name["3"]) * sortType);
          });
        break;
      case "workflowStateId":
        console.log("sort by Status")
        this.filteredProjects = this.filteredProjects
          .sort((a, b) => {
            return this.getStatusById(a.workflowStateId)?.name["3"]?.localeCompare((this.getStatusById(b.workflowStateId)?.name["3"])) * sortType;
          });
        break;
      case "UpdatedUserID":
        this.filteredProjects = this.filteredProjects
          .sort((a, b) => {

            return (this.getUserById(a.UpdatedUserID)?.name["3"] ?? "").localeCompare((this.getUserById(b.UpdatedUserID)?.name["3"] ?? "")) * sortType;
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

  private getAllProject() {
    return this.responseService.getResponseObservable()
      .subscribe(data => {
        this.projects = data;
        this.filteredProjects = this.projects;
        this.projectsFilteredBySearch = this.filteredProjects;
      });
  }

  private getProjectsCountry() {
    return this.countryService.getProjectsCountry(this.responseService.getResponseObservable())
      .subscribe(countries => this.projectCountries = <CountryModel[]>countries)
  }

  private getProjectsUser() {
    return this.userService.getProjectsUsers(this.responseService.getResponseObservable())
      .subscribe(users => this.projectUsers = <User[]>users)
  }

  private getProjectsStatus() {
    return this.statusService.getProjectsStatus(this.responseService.getResponseObservable())
      .subscribe(statuses => this.projectStatuses = <Status[]>statuses)
  }

  private getStatusById(id: number) {
    return <Status>this.projectStatuses.find(status => status?.WFSTATEID == id)
  }

  private getUserById(id: number) {
    return <User>this.projectUsers.find(user => user?.UserID == id)
  }

  private getCountryById(id: number): CountryModel {
    console.log(<CountryModel>this.projectCountries.find(country => country?.CountryId == id));
    return <CountryModel>this.projectCountries.find(country => country?.CountryId == id)
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
