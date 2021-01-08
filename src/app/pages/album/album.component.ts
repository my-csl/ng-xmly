import {Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ElementRef, ViewChild, Renderer2} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AlbumService, AlbumTrackArgs} from '../../services/apis/album.service';
import {forkJoin} from 'rxjs';
import {AlbumInfo, Anchor, RelateAlbum, Track} from '../../services/apis/types';
import {CategoryService} from '../../services/business/category.service';
import {IconType} from '../../shard/directives/icon/type';
import {FormBuilder} from '@angular/forms';


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
  };
  articleHeight: number;

  size = 16;
  form = this.fb.group({
    name: [''],
    size: [{value: 20, disabled: false}]
  });

  constructor(
    private activatedRoute: ActivatedRoute,
    private albumService: AlbumService,
    private categoryService: CategoryService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.initPageData();
    // this.trackParams.albumId = this.activatedRoute.snapshot.paramMap.get('this.trackParams.albumId')!;
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
          this.tracks = albumInfo.tracksInfo.tracks;
          this.total = albumInfo.tracksInfo.trackTotalCount;
          this.relateAlbums = relateAlbums.slice(0, 10);
          this.albumInfo = {...albumInfo.mainInfo, albumId: albumInfo.albumId};
          this.anchor = albumInfo.anchorInfo;
          this.categoryService.setSubCategory([albumInfo.mainInfo.albumTitle]);
          this.categoryService.getCategory().subscribe(
            category => {
              const pinyin = this.albumInfo.crumbs.categoryPinyin;
              if (category !== pinyin) {
                this.categoryService.setCategory(pinyin);
              }
            }
          );
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

  submit() {
    console.log('form', this.form.value);
  }

  sizeChange(size: number) {
    console.log('sizeChange', size);
  }
}
