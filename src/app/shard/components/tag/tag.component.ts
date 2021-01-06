import {
  Component,
  HostBinding,
  Input,
  ViewEncapsulation,
  EventEmitter,
  ElementRef,
  Renderer2,
  OnChanges,
  SimpleChanges, SimpleChange, Output
} from '@angular/core';

const ColorPresets = ['magenta', 'orange', 'green'];
type TagMode = 'default' | 'circle';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TagComponent implements OnChanges {

  @Input() xmColor = '';
  @Input() xmShape: TagMode = 'default';
  @Input() xmClosable = false;
  @Output() closed = new EventEmitter<void>();

  @HostBinding('class.xm-tag') xmTag = true;
  @HostBinding('class.xm-tag-circle') get circleCls(): boolean {return this.xmShape === 'circle'};
  @HostBinding('class.xm-tag-close') get closeCls(): boolean {return this.xmClosable};

  currentColor = '';

  constructor(private el: ElementRef, private rd2: Renderer2) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.setStyle(changes.xmColor);
  }

  private setStyle(color: SimpleChange) {
    if (!this.xmColor) {
      return;
    }
    if (ColorPresets.includes(this.xmColor)) {
      if (this.currentColor) {
        this.rd2.removeClass(this.el.nativeElement, this.currentColor);
      }
      this.currentColor = 'xm-tag-' + color.currentValue;
      this.rd2.addClass(this.el.nativeElement, 'xm-tag-' + color.currentValue);
      this.rd2.removeStyle(this.el.nativeElement,'color');
      this.rd2.removeStyle(this.el.nativeElement,'border-color');
      this.rd2.removeStyle(this.el.nativeElement,'background-color');
    } else {
      this.rd2.setStyle(this.el.nativeElement,'color', '#fff');
      this.rd2.setStyle(this.el.nativeElement,'border-color', 'transparent');
      this.rd2.setStyle(this.el.nativeElement,'background-color', this.xmColor);
    }
  }

}
