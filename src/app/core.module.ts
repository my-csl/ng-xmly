import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {HeaderComponent} from './layouts/header/header.component';
import {BreadcrumbModule} from './shard/components/breadcrumb/breadcrumb.module';
import {HttpClientModule} from '@angular/common/http';
import {PagesModule} from './pages/pages.module';


@NgModule({
  declarations: [HeaderComponent],
  exports: [HeaderComponent, BreadcrumbModule, BrowserModule, AppRoutingModule],
  imports: [
    BrowserModule,
    HttpClientModule,
    BreadcrumbModule,
    PagesModule,
    AppRoutingModule
  ]
})
export class CoreModule {
}
