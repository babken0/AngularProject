import {Injectable} from '@angular/core';
import {User} from "../models/User.model";
import {map} from "rxjs/operators";
import {Observable, forkJoin} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {ProjectModel} from "../models/project.model";


@Injectable()
export class UserService {

  constructor(private http: HttpClient) {
  }

  private getUsersObservable(): Observable<User[]> {
    return this.http.get("../../assets/Users.json")
      .pipe(map(data => data["data"] as User[]))
  }

  getUserById(userId: number): Observable<User> {
    return <Observable<User>>this.getUsersObservable()
      .pipe(map(users => users.find(user => user.UserID == userId)))
  }

  getProjectsUsers(projectsObservable: Observable<ProjectModel[]>): Observable<User[]> {
    const usersObservable = this.getUsersObservable();
    return forkJoin([
      projectsObservable, usersObservable])
      .pipe(map(([projects, users]) => {
          return <User[]>projects.map(project => users.find(user => user.UserID == project.UpdatedUserID))
        })
      )
  }

}
