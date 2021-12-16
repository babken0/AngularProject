import {Pipe, PipeTransform} from '@angular/core';
import {UserService} from "../services/user.service";

// TODO: Rename to username
@Pipe({
  name: 'userName'
})
export class UserNamePipe implements PipeTransform {
  constructor(private userService: UserService) {
  }

  transform(id: number): string {
    return this.userService.getUserById(id)?.name[3];
  }
}
