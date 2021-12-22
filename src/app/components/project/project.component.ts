import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ResponseService} from "../../core/services/response.service";

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {
  intervention:Object = {}

  constructor(private route:ActivatedRoute,
              private responseService:ResponseService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      return this.responseService.getResponseByInterventionCode(params["id"]).subscribe(intervention => this.intervention = intervention)
    })
  }


}
