import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {SearchComponent} from './components/search/search.component';
import {ContentComponent} from "./components/content/content.component";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {SharedModule} from "./shared/shared.module";
import {CoreModule} from "./core/core.module";
import {AppRoutingModule} from "./app-routing.module";
import {RootComponent} from './components/root/root.component';
import {NgxPaginationModule} from "ngx-pagination";

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
    AppRoutingModule,
    NgxPaginationModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
