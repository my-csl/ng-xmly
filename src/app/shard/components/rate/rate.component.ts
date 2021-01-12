import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnInit,
  Output, TemplateRef,
  ViewEncapsulation
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'app-rate',
  templateUrl: './rate.component.html',
  styleUrls: ['./rate.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RateComponent),
      multi: true
    }
  ]
})
export class RateComponent implements OnInit, ControlValueAccessor {

  @Input() count = 5;
  @Input() tpl: TemplateRef<void>;
  @Output() changed = new EventEmitter<number>();
  private readonly = false;
  starArray: number[] = [];
  hoverValue = 0;
  actualValue = 0;
  hasHalf = false;
  rateItemCls: string[] = [];

  constructor(private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.updateStartArray();
  }

  private updateStartArray() {
    this.starArray = Array(this.count).fill(0).map((item, index) => index);
  }

  starClick(isHalf: boolean, index: number) {
    if (this.readonly) {
      return;
    }
    this.hoverValue = index + 1;
    this.hasHalf = isHalf;
    this.setActualValue(isHalf ? index + 0.5 : this.hoverValue);
    this.updateRateCls();
  }

  starHover(isHalf: boolean, index: number) {
    if (this.readonly || (this.hoverValue === index + 1 && this.hasHalf === isHalf)) {
      return;
    }
    this.hoverValue = index + 1;
    this.hasHalf = isHalf;
    this.updateRateCls();
  }

  rateLeave() {
    // Number.isInteger(number)整数返回true 反之返回false
    this.hasHalf = !Number.isInteger(this.actualValue);
    this.hoverValue = Math.ceil(this.actualValue);
    this.updateRateCls();
  }

  private setActualValue(value: number) {
    if (this.actualValue !== value) {
      this.actualValue = value;
      this.onChange(value);
      this.changed.emit(value);
    }
  }

  private updateRateCls() {
    this.rateItemCls = this.starArray.map(index => {
      const base = 'xm-rate-item';
      const value = index + 1;
      let cls = '';
      if (value < this.hoverValue || (!this.hasHalf && value === this.hoverValue)) {
        cls = base + '-full';
      } else if (this.hasHalf && value === this.hoverValue) {
        cls = base + '-half';
      }
      let readonlyCls = this.readonly ? ` ${base}-readonly ` : ' ';
      return base + readonlyCls + cls;
    });
  }

  private onChange = (value: number) => {
  };
  private onTouched = () => {
  };

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.readonly = isDisabled;
  }

  writeValue(value: number): void {
    if (value) {
      this.actualValue = value;
      this.rateLeave();
      this.cdr.markForCheck();
    }
  }

}
