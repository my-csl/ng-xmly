import {Directive, ElementRef, HostBinding, Input, OnChanges, Renderer2, SimpleChanges} from '@angular/core';
import {IconType} from './type';

/*
*
*   host: {
    '[class.iconfont]': 'true' 元数据上绑定class
  }
* */
@Directive({
  selector: '[appIcon]',
})
export class IconDirective implements OnChanges{

  @HostBinding('class.iconfont') readonly hostCls= true;

  @Input('appIcon') type: IconType | undefined;

  constructor(private el: ElementRef, private rd2: Renderer2) {

  }

  ngOnChanges(changes: SimpleChanges): void {
    const { type } = changes;
    if (type.previousValue) {
      this.rd2.removeClass(this.el.nativeElement, 'icon-' + type.previousValue);
    }
    this.rd2.addClass(this.el.nativeElement, 'icon-' + type.currentValue);
  }

}
