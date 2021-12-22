import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { SearchComponent } from './components/search/search.component';
import {ContentComponent} from "./components/content/content.component";
import {CommonModule} from "@angular/common";
import { UserNamePipe } from './shared/pipes/user-name.pipe';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {StatusNamePipe } from './shared/pipes/status-name.pipe';
import { BgColorDirective } from './shared/directives/bg-color.directive';
import {HttpClientModule} from "@angular/common/http";
import { CountryNamePipe } from './shared/pipes/country-name.pipe';
import {SharedModule} from "./shared/shared.module";
import {CoreModule} from "./core/core.module";
import {AppRoutingModule} from "./app-routing.module";
import { RootComponent } from './components/root/root.component';


@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    ContentComponent,
    RootComponent,

  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SharedModule,
    CoreModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
