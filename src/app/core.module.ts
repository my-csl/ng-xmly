import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {HeaderComponent} from './layouts/header/header.component';
import {BreadcrumbModule} from './shard/components/breadcrumb/breadcrumb.module';


@NgModule({
  declarations: [HeaderComponent],
  exports: [
    HeaderComponent, BreadcrumbModule
  ],
  imports: [
    BrowserModule,
    BreadcrumbModule,
    AppRoutingModule
  ]
})
export class CoreModule {
}
