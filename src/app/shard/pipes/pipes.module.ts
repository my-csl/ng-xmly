import { NgModule } from '@angular/core';
import {NumberFormatPipe} from './number-format.pipe';

@NgModule({
  exports: [
    NumberFormatPipe
  ],
  declarations: [NumberFormatPipe]
})
export class PipesModule { }
