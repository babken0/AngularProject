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


@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    ContentComponent,
    UserNamePipe,
    StatusNamePipe,
    BgColorDirective
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
