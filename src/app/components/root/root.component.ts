import {Component} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {SearchModel} from "../../core/models/search.model";

@Component({
  selector: 'app-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.css']
})
export class RootComponent {
  form!: FormGroup
  searchData!: SearchModel

  getSearchData(search: SearchModel) {
    this.searchData = search;
  }
}
