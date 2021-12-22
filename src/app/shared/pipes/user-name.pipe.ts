import {Pipe, PipeTransform} from '@angular/core';
import {UserService} from "../../core/services/user.service";
import {map} from "rxjs/operators";
import {Observable} from "rxjs";

// TODO: Rename to username
@Pipe({
  name: 'userName'
})
export class UserNamePipe implements PipeTransform {
  constructor(private userService: UserService) {
  }

  transform(id: number):Observable<string> {
    return  this.userService.getUserById(id)
      .pipe(map(user => user?.name["3"]))
  }
}
