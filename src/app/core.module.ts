import { NgModule } from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import { HeaderComponent } from './layouts/header/header.component';



@NgModule({
  declarations: [HeaderComponent],
  exports: [
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ]
})
export class CoreModule { }
