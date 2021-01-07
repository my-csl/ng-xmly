import {Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AlbumService, AlbumTrackArgs} from '../../services/apis/album.service';
import {forkJoin} from 'rxjs';
import {AlbumInfo, Anchor, RelateAlbum, Track} from '../../services/apis/types';
import {CategoryService} from '../../services/business/category.service';


interface moreStateType {
  full: boolean,
  label: string,
  icon: string
}

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlbumComponent implements OnInit {

  albumInfo: AlbumInfo | undefined;
  score: number | undefined;
  anchor: Anchor | undefined;
  relateAlbums: RelateAlbum[] = [];
  tracks: Track[] = [];
  total = 0;
  trackParams: AlbumTrackArgs = {
    albumId: '',
    sort: 1,
    pageNum: 1,
    pageSize: 30
  };

  moreState: moreStateType = {
    full: false,
    label: '显示全部',
    icon: 'arrow-down-line'
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private albumService: AlbumService,
    private categoryService: CategoryService,
    private cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(
      albumId => {
        this.trackParams.albumId = albumId.get('albumId')!;
        forkJoin([
          this.albumService.getAlbum(this.trackParams.albumId),
          this.albumService.getAlbumScore(this.trackParams.albumId),
          this.albumService.getRelateAlbums(this.trackParams.albumId)
        ]).subscribe(([albumInfo, score, relateAlbums]) => {
          this.score = score;
          this.tracks = albumInfo.tracksInfo.tracks;
          this.total = albumInfo.tracksInfo.trackTotalCount;
          this.relateAlbums = relateAlbums.slice(0, 10);
          this.albumInfo = {...albumInfo.mainInfo, albumId: albumInfo.albumId};
          this.anchor = albumInfo.anchorInfo;
          this.categoryService.setSubCategory([albumInfo.mainInfo.albumTitle]);
          this.cdr.markForCheck();
        });
      }
    );
    // this.trackParams.albumId = this.activatedRoute.snapshot.paramMap.get('this.trackParams.albumId')!;
  }

  showMore() {
    this.moreState.full = !this.moreState.full;
    if (this.moreState.full) {
      this.moreState.label = '收起';
      this.moreState.icon = 'arrow-up-line';
    } else {
      this.moreState.label = '显示全部';
      this.moreState.icon = 'arrow-down-line';
    }
  }
}
