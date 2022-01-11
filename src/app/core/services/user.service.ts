import {Injectable} from '@angular/core';
import {User} from "../models/User.model";
import {map, shareReplay} from "rxjs/operators";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";


@Injectable()
export class UserService {
  users$ !: Observable<User[]>

  constructor(private http: HttpClient) {
    this.users$ = this.http.get("../../assets/Users.json")
      .pipe(map(data => {
          return data["data"] as User[]
        }),
        shareReplay({bufferSize: 1, refCount: true}))
  }

  getUsers(): Observable<User[]> {
    return this.users$;
  }

  getUserById(userId: number): Observable<User> {
    return <Observable<User>>this.users$
      .pipe(map(users => users.find(user => user.UserID == userId)))
  }

}
