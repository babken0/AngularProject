import {Injectable} from '@angular/core';
import * as users from "../../assets/Users.json";
import {User} from "../models/User.model";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() {
  }

  private getUsers() {
    return users;
  }

  getUserById(userId: number): User {
    return <User>this.getUsers().data.find(data => data.UserID == userId)
  }
}
