import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  forwardRef,
  HostBinding,
  HostListener, Input,
  OnInit, Optional,
  ViewEncapsulation
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {CheckboxGroupComponent, CheckboxValue} from './checkbox-group.component';

@Component({
  selector: 'label[app-checkbox]',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true
    }
  ],
  host: {
    '[class.xm-checkbox-wrap]': 'true'
  },
  encapsulation: ViewEncapsulation.None
})
export class CheckboxComponent implements OnInit, ControlValueAccessor {

  @HostBinding('class.checked') checked = false;
  @HostBinding('class.disabled') disabled = false;

  @Input() value: CheckboxValue;

  @HostListener('click', ['$event'])
  onCheck(event: MouseEvent) {
    event.preventDefault();
    if (!this.disabled) {
      this.checked = !this.checked;
      this.onChange(this.checked);
      if (this.parent) {
        this.parent.handleCheckboxClick(this.value, this.checked);
      }
    }
  }

  constructor(private cdr: ChangeDetectorRef, @Optional() private parent: CheckboxGroupComponent) {

  }

  private onChange = (value: boolean) => {
  };
  private onTouched = () => {
  };

  ngOnInit(): void {
    if (this.parent) {
      this.parent.addCheckbox(this);
    }
  }

  writeValue(value: boolean): void {
    this.checked = value;
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
  }


}
