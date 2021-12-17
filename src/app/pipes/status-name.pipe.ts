import {Pipe, PipeTransform} from '@angular/core';
import {StatusService} from "../services/status.service";
import {Status} from "../models/status.model";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";

@Pipe({
  name: 'statusName'
})
export class StatusNamePipe implements PipeTransform {
  constructor(private statusService: StatusService) {
  }

  transform(id: number): Observable<string> {
    return this.statusService.getStatusById(id)
      .pipe(map(status=> status.name["3"]));
  }
}
