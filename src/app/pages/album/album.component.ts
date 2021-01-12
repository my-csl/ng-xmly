import {Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ElementRef, ViewChild, Renderer2} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AlbumService, AlbumTrackArgs} from '../../services/apis/album.service';
import {forkJoin} from 'rxjs';
import {AlbumInfo, Anchor, RelateAlbum, Track} from '../../services/apis/types';
import {CategoryService} from '../../services/business/category.service';
import {IconType} from '../../shard/directives/icon/type';
import {storageKeys} from '../../configs';


interface moreStateType {
  full: boolean,
  label: string,
  icon: IconType
}

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlbumComponent implements OnInit {

  albumInfo: AlbumInfo;
  score: number;
  anchor: Anchor;
  relateAlbums: RelateAlbum[] = [];
  tracks: Track[] = [];
  trackSelected: Track[] = [];
  total = 0;
  trackParams: AlbumTrackArgs = {
    albumId: '',
    sort: 0,
    pageNum: 1,
    pageSize: 30
  };

  moreState: moreStateType = {
    full: false,
    label: '显示全部',
    icon: 'arrow-down-line'
  };
  articleHeight: number;

  constructor(
    private activatedRoute: ActivatedRoute,
    private albumService: AlbumService,
    private categoryService: CategoryService,
    private cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this.initPageData();
  }

  private initPageData() {
    this.activatedRoute.paramMap.subscribe(
      albumId => {
        this.trackParams.albumId = albumId.get('albumId')!;
        forkJoin([
          this.albumService.getAlbum(this.trackParams.albumId),
          this.albumService.getAlbumScore(this.trackParams.albumId),
          this.albumService.getRelateAlbums(this.trackParams.albumId)
        ]).subscribe(([albumInfo, score, relateAlbums]) => {
          this.score = score;
      /*    this.tracks = albumInfo.tracksInfo.tracks;
          this.total = albumInfo.tracksInfo.trackTotalCount;*/
          this.relateAlbums = relateAlbums.slice(0, 10);
          this.albumInfo = {...albumInfo.mainInfo, albumId: albumInfo.albumId};
          this.anchor = albumInfo.anchorInfo;
          this.categoryService.setSubCategory([albumInfo.mainInfo.albumTitle]);

          this.updateTracks();

          const pinyin = this.albumInfo.crumbs.categoryPinyin;
          const cache = localStorage.getItem(storageKeys.categoryPinyin);
          if (pinyin !== cache) {
            this.categoryService.setCategory(pinyin);
          }
          /*this.categoryService.getCategory().subscribe(
            category => {
              const pinyin = this.albumInfo.crumbs.categoryPinyin;
              if (category !== pinyin) {
                // get的时候又set会造成循环依赖的问题
                this.categoryService.setCategory(pinyin);
              }
            }
          );*/
          this.moreState = {
            full: false,
            label: '显示全部',
            icon: 'arrow-down-line'
          };
          this.cdr.markForCheck();
        });
      }
    );
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

  changePage(pageNum: number) {
    if (this.trackParams.pageNum !== pageNum) {
      this.trackParams.pageNum = pageNum;
      this.updateTracks();
    }
  }

  private updateTracks() {
    this.albumService.getTracks(this.trackParams).subscribe(res => {
      this.tracks = res.tracks;
      this.total = res.trackTotalCount;
      this.cdr.markForCheck();
    });
  }

  checkChange(check: boolean, track: Track) {
    const targetIndex = this.selectIndex(track.trackId);
    if (check) {
      if (targetIndex === -1) {
        this.trackSelected.push(track);
      }
    } else {
      if (targetIndex > -1) {
        this.trackSelected.splice(targetIndex, 1);
      }
    }
  }

  checkAllChange(check: boolean) {
    this.tracks.forEach(item => {
      const targetIndex = this.selectIndex(item.trackId);
      if (check) {
        if (targetIndex === -1) {
          this.trackSelected.push(item);
        }
      } else {
        if (targetIndex > -1) {
          this.trackSelected.splice(targetIndex, 1);
        }
      }
    });
  }

  private selectIndex(id: number) {
    return this.trackSelected.findIndex(item => item.trackId === id);
  }

  isChecked(trackId: number): boolean {
    const targetIndex = this.selectIndex(trackId);
    return targetIndex > -1;
  }

  isCheckedAll() {
    if (this.trackSelected.length >= this.tracks.length) {
      return this.tracks.every(item => {
        return this.selectIndex(item.trackId) > -1;
      });
    }
    return false;
  }
}
