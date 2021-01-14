import {Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter, TemplateRef, ViewContainerRef} from '@angular/core';

@Component({
  selector: 'app-rate-item',
  templateUrl: './rate-item.component.html',
  styleUrls: ['./rate-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RateItemComponent implements OnInit {

  @Input() rateItemCls = 'xm-rate-item'
  @Input() tpl: TemplateRef<void>;
  @Output() hoverValue = new EventEmitter<boolean>();
  @Output() clickValue = new EventEmitter<boolean>();

  constructor() {
  }

  ngOnInit(): void {
  }

  clickStar(isHalf: boolean) {
    // console.log('click',isHalf);
    this.clickValue.emit(isHalf);
  }

  hoverStar(isHalf: boolean) {
    // console.log('hover',isHalf);
    this.hoverValue.emit(isHalf);
  }
}
