import {
  AfterViewInit,
  ContentChildren,
  Directive,
  ElementRef,
  HostListener,
  Inject, Input,
  PLATFORM_ID,
  QueryList,
  Renderer2
} from '@angular/core';
import {DOCUMENT, isPlatformBrowser} from '@angular/common';
import {DragHandlerDirective} from './drag-handler.directive';
import { clamp } from 'lodash';

interface StartPosition {
  x: number,
  y: number,
  left?: number,
  top?: number
}

@Directive({
  selector: '[appDrag]'
})
export class DragDirective implements AfterViewInit {

  @Input() private limitInWindow = false
  private startPosition: StartPosition;
  private hostEl: HTMLElement;
  private movable = false;
  private dragMoveHandler: () => void;
  private dragEndHandler: () => void;

  @ContentChildren(DragHandlerDirective, {descendants: true}) handlers: QueryList<DragHandlerDirective>;

  constructor(
    @Inject(DOCUMENT) private doc: Document,
    @Inject(PLATFORM_ID) private platformId: object,
    private el: ElementRef,
    private rd2: Renderer2
  ) {
  }

  ngAfterViewInit(): void {
    this.hostEl = this.el.nativeElement;
    this.setHandlerStyle();
  }

  @HostListener('mousedown', ['$event'])
  onMousedown(event: MouseEvent) {
    if (isPlatformBrowser(this.platformId)) {
      // some方法检测数组里面是否至少有一个元素通过了测试，返回布尔值  contains方法表示传过来的节点是否为该节点的后代节点(包含元素本身)，返回布尔值
      const allowDrag = event.button === 0 && (!this.handlers.length || this.handlers.some(item => item.el.nativeElement.contains(event.target)));
      if (allowDrag) {
        event.preventDefault();
        event.stopPropagation();
        const {left, top} = this.hostEl.getBoundingClientRect();
        this.startPosition = {
          x: event.clientX,
          y: event.clientY,
          left,
          top
        };
        this.toggleMoving(true);
      }

    }
  }

  private toggleMoving(movable: boolean) {
    this.movable = movable;
    if (movable) {
      this.dragMoveHandler = this.rd2.listen(this.doc, 'mousemove', this.dragMove.bind(this));
      this.dragEndHandler = this.rd2.listen(this.doc, 'mouseup', this.dragEnd.bind(this));
    } else {
      // renderer2的listen方法返回一个 "取消监听" 函数，用于解除该处理器。
      if (this.dragMoveHandler) {
        this.dragMoveHandler();
      }
      if (this.dragEndHandler) {
        this.dragEndHandler();
      }
    }
  }

  private dragMove(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const diffX = event.clientX - this.startPosition.x;
    const diffY = event.clientY - this.startPosition.y;
    const {left, top} = this.calculate(diffX, diffY);
    this.rd2.setStyle(this.el.nativeElement, 'left', left + 'px');
    this.rd2.setStyle(this.el.nativeElement, 'top', top + 'px');
  }

  private calculate(diffX: number, diffY: number): { left: number, top: number } {
    let newLeft = diffX + this.startPosition.left!;
    let newTop = diffY + this.startPosition.top!;
    if (this.limitInWindow) {
      const {width, height} = this.hostEl.getBoundingClientRect();
      const maxLeft = this.doc.documentElement.clientWidth - width;
      const maxTop = this.doc.documentElement.clientHeight - height;
      newLeft = clamp(newLeft, 0, maxLeft);
      newTop = clamp(newTop, 0, maxTop);
    }
    return {
      left: newLeft,
      top: newTop
    };
  }

  private dragEnd(): void {
    this.toggleMoving(false);
  }

  private setHandlerStyle() {
    if (this.handlers.length) {
      this.handlers.forEach(item => this.rd2.setStyle(item.el.nativeElement, 'cursor', 'move'));
    } else {
      this.rd2.setStyle(this.hostEl, 'cursor', 'move');
    }
  }
}
