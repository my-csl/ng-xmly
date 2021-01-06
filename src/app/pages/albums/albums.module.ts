import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AlbumsRoutingModule} from './albums-routing.module';
import {AlbumsComponent} from './albums.component';
import {DirectivesModule} from '../../shard/directives/directives.module';
import {PipesModule} from '../../shard/pipes/pipes.module';
import {TagModule} from '../../shard/components/tag/tag.module';
import {PaginationModule} from '../../shard/components/pagination/pagination.module';


@NgModule({
  declarations: [AlbumsComponent],
  imports: [
    CommonModule,
    AlbumsRoutingModule,
    DirectivesModule,
    PipesModule,
    TagModule,
    PaginationModule
  ]
})
export class AlbumsModule {
}
