import {Component} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {SearchModel} from "./models/Search.model";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  form!: FormGroup
  searchData!: SearchModel

  getSearchData(search: SearchModel) {
    this.searchData = search;
  }
}
