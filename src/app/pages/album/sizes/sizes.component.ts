import {ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, OnInit} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'app-sizes',
  templateUrl: './sizes.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SizesComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
  export class SizesComponent implements OnInit, ControlValueAccessor {
  /* @Input() size: number = 16;
   @Output() sizeChange = new EventEmitter<number>()*/

  size: number;
  disable = false;

  constructor(private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
  }

  dec() {
    this.size += 1;
    this.onChange(this.size);
  }

  inc() {
    this.size -= 1;
    this.onChange(this.size);
  }

  private onChange = (value: number) => {
    console.log('value', value);
  };
  private onTouched = () => {
  };

  writeValue(value: number): void {
    console.log('writeValue', value);
    this.size = value;
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (value: number) => {}): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => {}): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    console.log('isDisabled', isDisabled);
    this.disable = isDisabled;
  }
}

