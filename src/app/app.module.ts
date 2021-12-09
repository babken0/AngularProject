import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { SearchComponent } from './search/search.component';
import {ContentComponent} from "./content/content.component";
import {CommonModule} from "@angular/common";
import { UserPipePipe } from './pipes/userPipe.pipe';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {StatusPipe } from './pipes/statusPipe.pipe';


@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    ContentComponent,
    UserPipePipe,
    StatusPipe
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
