import {Injectable} from '@angular/core';
import * as users from "../../assets/Users.json";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() {
  }
  private getUsers(){
    return users;
  }

  getUserData(){
    return this.getUsers().data;
  }

  getUserById(userId:number){
    return this.getUsers().data.find(data => data.UserID == userId)
  }
}
