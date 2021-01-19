import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StrTplOutletDirective} from './str-tpl-outlet.directive';
import {IconDirective} from './icon/icon.directive';
import {XmBtnDirective} from './xm-btn.directive';
import { ToggleMoreDirective } from './toggle-more.directive';
import {DragModule} from './drag/drag.module';


@NgModule({
  declarations: [StrTplOutletDirective, IconDirective, XmBtnDirective, ToggleMoreDirective],
  exports: [
    StrTplOutletDirective,
    IconDirective,
    XmBtnDirective,
    ToggleMoreDirective,
    DragModule
  ],
  imports: [
    CommonModule,
    DragModule
  ]
})
export class DirectivesModule {
}
