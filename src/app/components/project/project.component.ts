import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ProjectModel} from "../../core/models/project.model";
import {Observable} from "rxjs";
import {ProjectService} from "../../core/services/project.service";

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {
  intervention$!: Observable<ProjectModel>

  constructor(private route: ActivatedRoute,
              private projectService: ProjectService) {
  }

  ngOnInit(): void {
    this.intervention$ = this.projectService.getProject(this.route.snapshot.params["id"])
  }
}
