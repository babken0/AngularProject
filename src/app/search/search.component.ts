import { Component, OnInit } from '@angular/core';
import {CountryService} from "../services/country.service";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  countriesNameList :string[] = [];

  constructor(private countryService:CountryService) {
    this.countriesNameList = this.getCountriesName();
  }



  getCountriesName(){
    return this.countryService.getCountriesData().map(data => data.name[3])
  }
  ngOnInit(): void {
  }

}
