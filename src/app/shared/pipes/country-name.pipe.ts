import { Pipe, PipeTransform } from '@angular/core';
import {CountryService} from "../../core/services/country.service";
import {map} from "rxjs/operators";
import {Observable} from "rxjs";

@Pipe({
  name: 'countryName'
})
export class CountryNamePipe implements PipeTransform {
  constructor(private countryService:CountryService) {
  }

  transform(id: number): Observable<string> {
    return this.countryService.getCountryById(id)
      .pipe(map(country=> country.name["3"]))

  }


}
