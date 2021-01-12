import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CheckboxComponent} from './checkbox.component';
import { CheckboxGroupComponent } from './checkbox-group.component';


@NgModule({
  declarations: [CheckboxComponent, CheckboxGroupComponent],
  exports: [
    CheckboxComponent,
    CheckboxGroupComponent
  ],
  imports: [
    CommonModule
  ]
})
export class CheckboxModule {
}
