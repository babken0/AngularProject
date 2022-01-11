import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {CountryService} from "../../core/services/country.service";
import {CountryModel} from "../../core/models/country.model";
import {FormControl, FormGroup} from "@angular/forms";
import {SearchModel} from "../../core/models/search.model";
import {Observable} from "rxjs";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  @Output() search = new EventEmitter<SearchModel>()
  public countries$!: Observable<CountryModel[]>;
  public formGroup!: FormGroup;

  constructor(private countryService: CountryService) {
    this.formGroup = SearchComponent.createFormGroup()
  }

  ngOnInit(): void {
    this.countries$ = this.countryService.getCountries()
  }

  private static createFormGroup() {
    return new FormGroup(
      {
        country: new FormControl("0"),
        keyword: new FormControl(""),
        codeOfIntervention: new FormControl(""),
        titleOfIntervention: new FormControl(""),
        interventionShortName: new FormControl(""),
        interventionDescription: new FormControl(""),
        startDateFrom: new FormControl(""),
        startDateTo: new FormControl(""),
      }
    );
  }

  onSearch() {
    this.search.emit(this.createSearchModel());
  }

  onReset() {
    this.search.emit();
  }

  createSearchModel(): SearchModel {
    return {
      countryId: +this.formGroup.controls["country"].value,
      keyword: this.formGroup.controls["keyword"].value,
      codeOfIntervention: this.formGroup.controls["codeOfIntervention"].value,
      titleOfIntervention: this.formGroup.controls["titleOfIntervention"].value,
      interventionShortName: this.formGroup.controls["interventionShortName"].value,
      interventionDescription: this.formGroup.controls["interventionDescription"].value,
      startDateFrom: this.formGroup.controls["startDateFrom"].value,
      startDateTo: this.formGroup.controls["startDateTo"].value,
    }
  }
}
