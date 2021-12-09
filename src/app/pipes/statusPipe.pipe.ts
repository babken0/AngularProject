import {Pipe, PipeTransform} from '@angular/core';
import {StatusService} from "../services/status.service";
import {Status} from "../models/status.model";

@Pipe({
  name: 'statusPipe'
})
export class StatusPipe implements PipeTransform {
  constructor(private statusService:StatusService) {
  }
  transform(id: number ): Status {
    return this.statusService.getStatusById(id) as Status;
  }

}
