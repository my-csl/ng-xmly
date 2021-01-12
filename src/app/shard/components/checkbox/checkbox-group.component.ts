import {Component, OnInit, ChangeDetectionStrategy, Input, forwardRef} from '@angular/core';
import {CheckboxComponent} from './checkbox.component';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';


export type CheckboxValue = number | string;

@Component({
  selector: 'app-checkbox-group',
  template: `
    <div class="xm-checkbox-group">
      <ng-content></ng-content>
    </div>
  `,
  styles: [
    `
      .xm-checkbox-group {
        display: inline-block;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxGroupComponent),
      multi: true
    }
  ],
})
export class CheckboxGroupComponent implements OnInit, ControlValueAccessor {

  checkboxes: CheckboxComponent[] = [];
  current: CheckboxValue[] = [];

  /*
    @Input()
    set initCurrent(checks: CheckboxValue[]) {
      this.current = checks;
      if (checks.length) {
        setTimeout(() => {
          this.updateCheckBox(checks);
        }, 0);
      }
    }*/

  constructor() {
  }

  ngOnInit(): void {
  }

  private onChange = (value: CheckboxValue[]) => {
  };
  private onTouched = () => {
  };

  registerOnChange(fn: (value: CheckboxValue[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  writeValue(value: CheckboxValue[]): void {
    if (value) {
      this.current = value;
      this.updateCheckBox(value);
    }
  }

  addCheckbox(checkbox: CheckboxComponent) {
    this.checkboxes.push(checkbox);
  }

  updateCheckBox(checks: CheckboxValue[]) {
    if (this.checkboxes.length) {
      this.checkboxes.forEach(item => {
        item.writeValue(checks.includes(item.value));
      });
    }
    this.current = checks;
    this.onChange(this.current);
  }


  handleCheckboxClick(value: CheckboxValue, checked: boolean) {
    const newCurrent = this.current.slice();
    if (checked) {
      if (!newCurrent.includes(value)) {
        newCurrent.push(value);
      }
    } else {
      const targetIndex = newCurrent.findIndex(item => item === value);
      if (targetIndex > -1) {
        newCurrent.splice(targetIndex, 1);
      }
    }
    this.writeValue(newCurrent);
    console.log('newCurrent',newCurrent);
  }
}
