import { Injectable } from '@angular/core';
import  * as countries from "../../assets/Countries.json";

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  constructor() { }

  getCountries(){
    return countries;
  }
}
