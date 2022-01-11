import {Component, Input, OnChanges, OnInit, SimpleChanges,} from '@angular/core';
import {ProjectService} from "../../core/services/project.service";
import {ProjectModel} from "../../core/models/project.model";
import {StatusService} from "../../core/services/status.service";
import {SearchModel} from "../../core/models/search.model";
import {Sort} from "../../core/models/Sort.model";
import {FormControl} from "@angular/forms";


@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit, OnChanges {
  @Input() searchData!: SearchModel;
  filteredProjects: ProjectModel[] = [];
  projects: ProjectModel[] = [];
  selectedControl!: FormControl;
  selectedStatusId: number = 0;
  sortBy!: Sort
  sortClickCount: number = 0;
  previousSortOption: string = "";
  totalPagesCount: number = 0;
  currentPage: number = 1;

  constructor(private statusService: StatusService,
              private projectService: ProjectService) {
  }

  ngOnInit(): void {
    this.initResponses();
    this.selectedControl = new FormControl(0);
    this.selectedControl.valueChanges.subscribe(()=>this.onStatusChange())
  }

  initResponses(): void {
    this.projectService.getProjects().subscribe(projects => {
      this.filteredProjects = projects;
      this.projects = projects;
      this.totalPagesCount = projects.length;
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.projectService.getProjectsByFilter(this.searchData, this.selectedStatusId, this.sortBy)
      .subscribe(projects => {
        this.filteredProjects = projects;
        this.totalPagesCount = projects.length;
      })
  }

  sortData(sortBy: string): void {
    if (this.previousSortOption == sortBy) {
      this.sortClickCount *= -1;
    } else {
      this.previousSortOption = sortBy;
      this.sortClickCount = 1;
    }
    this.sortBy = {name: sortBy, option: this.sortClickCount};

    this.projectService.getProjectsByFilter(this.searchData, this.selectedStatusId, this.sortBy)
      .subscribe(projects => this.filteredProjects = projects);
  }

  getStatusIdes(): number[] {
    const statuses = this.projects.map(data => data.workflowStateId);
    this.totalPagesCount = this.filteredProjects.length;
    return statuses.filter((c, index) => statuses.indexOf(c) === index);
  }

  onStatusChange(): void {
    this.selectedStatusId = +this.selectedControl.value;
    this.projectService.getProjectsByFilter(this.searchData, this.selectedStatusId, this.sortBy).subscribe(projects => this.filteredProjects = projects);
    this.totalPagesCount = this.filteredProjects.length;
  }

}
