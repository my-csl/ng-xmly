import {Directive, ElementRef} from '@angular/core';

@Directive({
  selector: '[appDragHandler]'
})
export class DragHandlerDirective {

  constructor(readonly el: ElementRef) { }

}
