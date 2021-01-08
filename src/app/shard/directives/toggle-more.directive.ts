import {Directive, ElementRef, Input, OnChanges, OnInit, Output, Renderer2, SimpleChanges,EventEmitter} from '@angular/core';
import {timer} from 'rxjs';

@Directive({
  selector: '[appToggleMore]'
})
export class ToggleMoreDirective implements OnInit, OnChanges {

  @Input() content: any;
  @Input() isFull = false;
  @Input('appToggleMore') maxHeight = 0;
  @Output() initTrueHeight = new EventEmitter<number>();
  private trueHeight = this.maxHeight;

  constructor(private el: ElementRef, private rd2: Renderer2) {

  }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges): void {
    /*const rect = this.el.nativeElement.getBoundingClientRect(); //734
    console.log('rect', rect);*/
    if (changes.content?.currentValue) {
      timer(100).subscribe(() => {
        this.trueHeight = this.hiddenDomRect(this.el.nativeElement).height;
        this.initTrueHeight.emit(this.trueHeight);
      });
    }
    if (changes.isFull) {
      const maxHeight = changes.isFull.currentValue ? this.trueHeight : this.maxHeight;
      this.rd2.setStyle(this.el.nativeElement, 'maxHeight', maxHeight + 'px');
    }
  }

  private hiddenDomRect(dom: HTMLElement): DOMRect {
    const cloneNode = dom.cloneNode(true) as HTMLElement;
    this.rd2.setStyle(cloneNode, 'visibility', 'hidden'); // 隐藏dom
    this.rd2.setStyle(cloneNode, 'pointerEvent', 'none'); // 禁止事件
    this.rd2.setStyle(cloneNode, 'position', 'absolute');
    this.rd2.setStyle(cloneNode, 'maxHeight', 'unset'); // 取消高度限制获取真实高度
    this.rd2.appendChild(dom.parentNode, cloneNode);
    const rect = cloneNode.getBoundingClientRect();
    this.rd2.removeChild(dom.parentNode, cloneNode);
    console.log('rect', rect);
    return rect;
  }
}
