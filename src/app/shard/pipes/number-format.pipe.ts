import { Pipe, PipeTransform } from '@angular/core';
import {round} from 'lodash';

enum Exponent {
  '万' = 10000,
  '亿' = 100000000
}

const defaultConfig:FormatNumberConfig = {
  unit: '万',
  precision: 2
}

interface FormatNumberConfig {
  unit?: string,
  precision?: number;
}

@Pipe({
  name: 'numberFormat'
})
export class NumberFormatPipe implements PipeTransform {

  transform(value: number, config: FormatNumberConfig = defaultConfig): number {
    // @ts-ignore
    const unit = Exponent[config.unit || defaultConfig.unit] ;
    return round(value / unit, config.precision || defaultConfig.precision);
  }

}
