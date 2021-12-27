import {Injectable} from '@angular/core';
import {User} from "../models/User.model";
import {map, share, shareReplay} from "rxjs/operators";
import {Observable, forkJoin,of} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {ProjectModel} from "../models/project.model";



@Injectable()
export class UserService {
  users$ !:Observable<User[]>

  constructor(private http: HttpClient) {
    this.users$ = this.http.get("../../assets/Users.json")
      .pipe(map(data => {
        return data["data"] as User[]
      }),
        shareReplay({bufferSize:1,refCount:true}))
  }

  private getUsers(): Observable<User[]> {
    return this.users$;
  }

  getUserById(userId: number): Observable<User> {

    return <Observable<User>>this.users$
      .pipe(map(users => users.find(user => user.UserID == userId)))
  }

  getProjectsUsers(projects$: Observable<ProjectModel[]>): Observable<User[]> {
    const users$ = this.getUsers();
    return forkJoin([projects$, users$])
      .pipe(map(([projects, users]) => {
          return <User[]> projects.map(project => users.find(user => user.UserID == project.UpdatedUserID))
        })
      )
  }

}
