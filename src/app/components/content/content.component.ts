import {Component, Input, OnChanges, OnInit, SimpleChanges,} from '@angular/core';
import {ProjectService} from "../../core/services/project.service";
import {ProjectModel} from "../../core/models/project.model";
import {StatusService} from "../../core/services/status.service";
import {SearchModel} from "../../core/models/search.model";
import {ResponseService} from "../../core/services/response.service";
import {Sort} from "../../core/models/Sort.model";
import {Router} from "@angular/router";

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit, OnChanges {
  @Input() searchData!: SearchModel;
  filteredProjects: ProjectModel[] = [];
  projects: ProjectModel[] = []
  selectedStatusId: number = 0;
  sortBy!: Sort
  count: number = 0;
  previousSort: string = "";
  color: string = 'white';

  constructor(
    private _router: Router,
    private statusService: StatusService,
    private responseService: ResponseService,
    private projectService: ProjectService) {
  }

  ngOnInit(): void {
    this.getAllResponse()
  }

  getAllResponse() {
    this.responseService.getResponseObservable().subscribe(
      projects => {
        this.filteredProjects = projects
        this.projects = projects
      })
  }


  ngOnChanges(changes: SimpleChanges): void {
    this.filteredProjects = this.projectService.getProjects(this.searchData, this.selectedStatusId, this.sortBy)
  }


  sortData(sortBy: string) {
    if (this.previousSort == sortBy) {
      this.count *= -1
    } else {
      this.previousSort = sortBy
      this.count = 1
    }
    this.sortBy = {name: sortBy, option: this.count}

    this.filteredProjects = this.projectService.getProjects(this.searchData, this.selectedStatusId, this.sortBy)
  }

  getStatusIdes(): number[] {
    const statuses = this.projects.map(data => data.workflowStateId);
    return statuses.filter((c, index) => statuses.indexOf(c) === index);
  }

  onStatusChange(id: string): void {
    this.selectedStatusId = +id;
    this.filteredProjects = this.projectService.getProjects(this.searchData, this.selectedStatusId, this.sortBy)
  }

  // public navigateToProject(interventionId: number): void {
  //   this._router.navigateByUrl("/projects/" + interventionId)
  // }

}
