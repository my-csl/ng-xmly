import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RateComponent } from './rate.component';
import { RateItemComponent } from './rate-item/rate-item.component';
import {DirectivesModule} from '../../directives/directives.module';



@NgModule({
  declarations: [RateComponent, RateItemComponent],
  exports: [
    RateComponent
  ],
  imports: [
    CommonModule,
    DirectivesModule
  ]
})
export class RateModule { }
