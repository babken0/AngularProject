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
import {map, shareReplay} from "rxjs/operators";
import {Observable, zip} from "rxjs";


@Injectable()
export class ProjectService {
  private projects$: Observable<ProjectModel[]>;
  searchData!: SearchModel;
  projects!: ProjectModel[];
  filteredProjects: ProjectModel[] = [];
  selectedStatusId: number = 0;
  projectsFilteredBySearch: ProjectModel[] = [];
  sort!: Sort

  constructor(private http: HttpClient,
              private countryService: CountryService,
              private statusService: StatusService,
              private userService: UserService) {
    this.projects$ = this.http.get("../../assets/response.json")
      .pipe(
        map(data => data["data"] as ProjectModel[]),
        shareReplay({bufferSize: 1, refCount: true})
      )
  }

  getProjects(): Observable<ProjectModel[]> {
    return this.projects$;
  }

  getProject(instanceId: number): Observable<ProjectModel> {
    return this.getProjects().pipe(
      map(interventions => <ProjectModel>interventions.find(intervention => intervention.InterventionInstanceId == instanceId))
    )
  }

  getProjectsByFilter(filterOption: SearchModel, statusId: number, sort: Sort): Observable<ProjectModel[]> {
    return zip(
      this.getProjects(),
      this.countryService.getCountries(),
      this.statusService.getStatuses(),
      this.userService.getUsers()
    ).pipe(
      map(([projects, countries, statuses, users]) => {
        this.projects = projects;
        this.filteredProjects = projects;
        this.searchData = filterOption;
        this.sort = sort
        this.selectedStatusId = statusId;
        this.filterAll();
        this.sortData(countries, statuses, users);

        return this.filteredProjects
      })
    )
  }

  private filterAll(): void {
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

  private filterByStatusId(statusId: number): void {
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

  private doFilterKeyword(): void {
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

  private filterByStartDate(): void {
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

  private sortData(countries: CountryModel[], statuses: Status[], users: User[]): void {
    let sortBy = this.sort?.name
    let sortType = this.sort?.option
    switch (sortBy) {
      case "InterventionCode":
      case "ShortName":
      case "Title":
        this.filteredProjects = this.filteredProjects
          .sort((a, b) => {
            return (a[sortBy]?.localeCompare(b[sortBy])) * sortType;
          });
        break;
      case "InterventionCountryID":
        this.filteredProjects = this.filteredProjects
          .sort((a, b) => {
            const firstCountryName = this.getCountryById(countries, a.InterventionCountryID)?.name["3"];
            const secondCountryName = this.getCountryById(countries, b.InterventionCountryID)?.name["3"];

            return (firstCountryName?.localeCompare(secondCountryName) * sortType);
          });
        break;
      case "workflowStateId":
        this.filteredProjects = this.filteredProjects
          .sort((a, b) => {
            const firstStatusName = this.getStatusById(statuses, a.workflowStateId)?.name["3"];
            const secondStatusName = this.getStatusById(statuses, b.workflowStateId)?.name["3"];
            return firstStatusName?.localeCompare(secondStatusName) * sortType;
          });
        break;
      case "UpdatedUserID":
        this.filteredProjects = this.filteredProjects
          .sort((a, b) => {
            const firstUserName = this.getUserById(users, a.UpdatedUserID)?.name["3"] ?? "";
            const secondUserName = this.getUserById(users, b.UpdatedUserID)?.name["3"] ?? "";
            return (firstUserName).localeCompare(secondUserName) * sortType;
          });
        break;
      case "DateUpdated":
        this.filteredProjects = this.filteredProjects
          .sort((a, b) => (a.DateUpdated - b.DateUpdated) * sortType);
        break;
    }
  }


  private getStatusById(statuses: Status[], id: number): Status {
    return <Status>statuses.find(status => status?.WFSTATEID == id)
  }

  private getUserById(users: User[], id: number): User {
    return <User>users.find(user => user?.UserID == id)
  }

  private getCountryById(countries: CountryModel[], id: number): CountryModel {
    return <CountryModel>countries.find(country => country?.CountryId == id)
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
