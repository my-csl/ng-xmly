import {NgModule, Optional, SkipSelf} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {HeaderComponent} from './layouts/header/header.component';
import {BreadcrumbModule} from './shard/components/breadcrumb/breadcrumb.module';
import {HttpClientModule} from '@angular/common/http';
import {PagesModule} from './pages/pages.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {LoginComponent} from './layouts/login/login.component';
import {DirectivesModule} from './shard/directives/directives.module';
import {CheckboxModule} from './shard/components/checkbox/checkbox.module';
import {ReactiveFormsModule} from '@angular/forms';


@NgModule({
  declarations: [HeaderComponent, LoginComponent],
  exports: [HeaderComponent, BreadcrumbModule, BrowserModule, AppRoutingModule, LoginComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    BreadcrumbModule,
    PagesModule,
    AppRoutingModule,
    DirectivesModule,
    CheckboxModule,
    ReactiveFormsModule
  ]
})
export class CoreModule {
  constructor(@SkipSelf() @Optional() private parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule只能被AppModule引入');
    }
  }
}
