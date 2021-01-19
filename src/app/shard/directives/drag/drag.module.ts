import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DragDirective} from './drag.directive';
import {DragHandlerDirective} from './drag-handler.directive';


@NgModule({
  declarations: [DragDirective, DragHandlerDirective],
  exports: [
    DragDirective, DragHandlerDirective
  ],
  imports: [
    CommonModule
  ]
})
export class DragModule {
}
