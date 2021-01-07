import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlbumRoutingModule } from './album-routing.module';
import { AlbumComponent } from './album.component';
import {TagModule} from '../../shard/components/tag/tag.module';
import {DirectivesModule} from '../../shard/directives/directives.module';
import {PipesModule} from '../../shard/pipes/pipes.module';


@NgModule({
  declarations: [AlbumComponent],
  imports: [
    CommonModule,
    AlbumRoutingModule,
    TagModule,
    DirectivesModule,
    PipesModule
  ]
})
export class AlbumModule { }
