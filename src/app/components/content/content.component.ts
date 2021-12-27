import {Component, Input, OnChanges, OnInit, SimpleChanges,} from '@angular/core';
import {ProjectService} from "../../core/services/project.service";
import {ProjectModel} from "../../core/models/project.model";
import {StatusService} from "../../core/services/status.service";
import {SearchModel} from "../../core/models/search.model";
import {Sort} from "../../core/models/Sort.model";


@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit, OnChanges {
  @Input() searchData!: SearchModel;
  filteredProjects: ProjectModel[] = [];
  projects: ProjectModel[] = [];
  selectedStatusId: number = 0;
  sortBy!: Sort
  count: number = 0;
  previousSort: string = "";
  color: string = 'white';
  total: number = 0;
  currentPage: number = 1;

  constructor(
    private statusService: StatusService,
    private projectService: ProjectService) {
  }

  ngOnInit(): void {
    this.getAllResponse()
  }

  getAllResponse() {
    this.projectService.getProjects().subscribe(projects => {
      this.filteredProjects = projects
      this.projects = projects
      this.total = projects.length
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.projectService.getProjectsByFilter(this.searchData, this.selectedStatusId, this.sortBy).subscribe(projects => this.filteredProjects = projects)
    this.total = this.filteredProjects.length
  }

  sortData(sortBy: string) {
    if (this.previousSort == sortBy) {
      this.count *= -1
    } else {
      this.previousSort = sortBy
      this.count = 1
    }
    this.sortBy = {name: sortBy, option: this.count}

    this.projectService.getProjectsByFilter(this.searchData, this.selectedStatusId, this.sortBy).subscribe(projects => this.filteredProjects = projects)
  }

  getStatusIdes(): number[] {
    const statuses = this.projects.map(data => data.workflowStateId);
    this.total = this.filteredProjects.length
    return statuses.filter((c, index) => statuses.indexOf(c) === index);
  }

  onStatusChange(id: string): void {
    this.selectedStatusId = +id;
    this.projectService.getProjectsByFilter(this.searchData, this.selectedStatusId, this.sortBy).subscribe(projects => this.filteredProjects = projects)
    this.total = this.filteredProjects.length
  }

}
