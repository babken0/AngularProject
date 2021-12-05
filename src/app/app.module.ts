import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { SearchComponent } from './search/search.component';
import {ContentComponent} from "./content/content.component";
import {CommonModule} from "@angular/common";
import { UserPipe } from './pipes/user.pipe';
import {ReactiveFormsModule} from "@angular/forms";
import {StatusPipe } from './pipes/statusPipe.pipe';


@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    ContentComponent,
    UserPipe,
    StatusPipe
  ],
  imports: [
    BrowserModule,
    CommonModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
