import { Pipe, PipeTransform } from '@angular/core';
import {UserService} from "../services/user.service";

// TODO: Rename to username
@Pipe({
  name: 'userPipe'
})
export class UserPipePipe implements PipeTransform {
  constructor(private userService:UserService) {
  }

  transform(id: number): string|undefined{
    return this.userService.getUserById(id)?.name[3];
  }

}
