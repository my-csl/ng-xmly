import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AlbumRoutingModule} from './album-routing.module';
import {AlbumComponent} from './album.component';
import {TagModule} from '../../shard/components/tag/tag.module';
import {DirectivesModule} from '../../shard/directives/directives.module';
import {PipesModule} from '../../shard/pipes/pipes.module';
import {SizesComponent} from './sizes/sizes.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CheckboxModule} from '../../shard/components/checkbox/checkbox.module';
import {PaginationModule} from '../../shard/components/pagination/pagination.module';
import {RateModule} from '../../shard/components/rate/rate.module';


@NgModule({
  declarations: [AlbumComponent, SizesComponent],
  imports: [
    CommonModule,
    AlbumRoutingModule,
    TagModule,
    DirectivesModule,
    PipesModule,
    ReactiveFormsModule,
    FormsModule,
    CheckboxModule,
    PaginationModule,
    RateModule
  ]
})
export class AlbumModule {
}
