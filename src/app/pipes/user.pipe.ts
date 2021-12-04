import { Pipe, PipeTransform } from '@angular/core';
import {UserService} from "../services/user.service";
import {ProjectModel} from "../models/Project.model";

@Pipe({
  name: 'user'
})
export class UserPipe implements PipeTransform {
  constructor(private userService:UserService) {
  }

  transform(id: number): string|undefined{
    return this.userService.getUserById(id)?.name[3];
  }

}
