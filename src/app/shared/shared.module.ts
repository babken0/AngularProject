import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BgColorDirective} from "./directives/bg-color.directive";
import {UserNamePipe} from "./pipes/user-name.pipe";
import {StatusNamePipe} from "./pipes/status-name.pipe";
import {CountryNamePipe} from "./pipes/country-name.pipe";


@NgModule({
  declarations: [
    BgColorDirective,
    UserNamePipe,
    StatusNamePipe,
    CountryNamePipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    BgColorDirective,
    UserNamePipe,
    StatusNamePipe,
    CountryNamePipe
  ],
})
export class SharedModule {
}
