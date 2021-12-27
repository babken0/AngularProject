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
import {Sort} from "../models/Sort.model";
import {map} from "rxjs/operators";
import {Observable, zip} from "rxjs";


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
  ) {
    this.loadProjects();
  }

  getProjects(): Observable<ProjectModel[]> {
    return this.http.get("../../assets/response.json")
      .pipe(map(data => {
        return data["data"] as ProjectModel[]
      }))
  }


  loadProjects(): void {
    this.http.get<ProjectModel[]>("../../assets/response.json").subscribe(projects => this.projects = projects)
  }

  getProject(instanceId: number): Observable<ProjectModel> {
    return this.getProjects().pipe(
      map(interventions => <ProjectModel>interventions.find(intervention => intervention.InterventionInstanceId == instanceId))
    )
  }


  getProjectsByFilter(filterOption: SearchModel, statusId: number, sort: Sort): Observable<ProjectModel[]> {
    return zip(
      this.getProjects(),
      this.getProjectsCountry(),
      this.getProjectsStatus(),
      this.getProjectsUser()
    ).pipe(
      map(([projects, countries, statuses, users]) => {
        this.projects = projects;
        this.filteredProjects = projects;
        this.projectCountries = countries;
        this.projectStatuses = statuses;
        this.projectUsers = users
        this.searchData = filterOption;
        this.sort = sort
        this.selectedStatusId = statusId;
        this.filterAll();
        this.sortData();

        return this.filteredProjects
      })
    )

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


  private getProjectsCountry(): Observable<CountryModel[]> {
    return this.countryService.getProjectsCountry(this.getProjects())

  }

  private getProjectsUser(): Observable<User[]> {
    return this.userService.getProjectsUsers(this.getProjects())
  }

  private getProjectsStatus(): Observable<Status[]> {
    return this.statusService.getProjectsStatus(this.getProjects())

  }

  private getStatusById(id: number): Status {
    return <Status>this.projectStatuses.find(status => status?.WFSTATEID == id)
  }

  private getUserById(id: number): User {
    return <User>this.projectUsers.find(user => user?.UserID == id)
  }

  private getCountryById(id: number): CountryModel {
    return <CountryModel>this.projectCountries.find(country => country?.CountryId == id)
  }

  onStatusChange(id: string): void {
    this.selectedStatusId = +id;
    this.filterByStatusId(this.selectedStatusId)
  }


  private static containsCode(keyword: string, isChecked: boolean, project: ProjectModel): boolean {
    return isChecked ? project?.InterventionCode?.toUpperCase()?.includes(keyword) : false;
  }

  private static containsTitle(keyword: string, isChecked: boolean, project: ProjectModel): boolean {
    return isChecked ? project?.Title?.toUpperCase()?.includes(keyword) : false;
  }

  private static containsShortName(keyword: string, isChecked: boolean, project: ProjectModel): boolean {
    return isChecked ? project?.ShortName?.toUpperCase()?.includes(keyword) : false;
  }

  private static containsDescription(keyword: string, isChecked: boolean, project: ProjectModel): boolean {
    return isChecked ? project?.Description?.toUpperCase()?.includes(keyword) : false;
  }


}
