import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { SearchComponent } from './search/search.component';
import {ContentComponent} from "./content/content.component";
import {CommonModule} from "@angular/common";
import { UserNamePipe } from './pipes/user-name.pipe';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {StatusNamePipe } from './pipes/status-name.pipe';
import { BgColorDirective } from './directives/bg-color.directive';
import {HttpClientModule} from "@angular/common/http";
import { CountryNamePipe } from './pipes/country-name.pipe';


@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    ContentComponent,
    UserNamePipe,
    StatusNamePipe,
    BgColorDirective,
    CountryNamePipe
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
