import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AlbumArgs, AlbumService, CategoryInfo} from '../../services/apis/album.service';
import {MetaData, MetaValue, SubCategory} from '../../services/apis/types';
import {CategoryService} from '../../services/business/category.service';
import {ActivatedRoute, Router} from '@angular/router';
import {withLatestFrom} from 'rxjs/operators';

interface CheckedMeta {
  metaRowId: number;
  metaRowName: string;
  metaId: number;
  metaName: string;
}

@Component({
  selector: 'app-albums',
  templateUrl: './albums.component.html',
  styleUrls: ['./albums.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlbumsComponent implements OnInit {

  searchParams: AlbumArgs = {
    category: '',
    subcategory: '',
    meta: '',
    sort: 0,
    page: 1,
    perPage: 30
  };
  categoryInfo: CategoryInfo | undefined;
  checkedMetas: CheckedMeta[] = [];

  constructor(
    private albumService: AlbumService,
    private cdr: ChangeDetectorRef,
    private categoryService: CategoryService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.pipe(
      withLatestFrom(this.categoryService.getCategory())
    ).subscribe(
      ([paramMap, category]) => {
        const pinyin = paramMap.get('pinyin');
        if (pinyin !== category) {
          this.categoryService.setCategory(pinyin!);
        }
        this.searchParams.category = pinyin!;
        this.searchParams.subcategory = '';
        this.categoryService.setSubCategory([]);
        this.updatePageDatas();
      }
    );
  }

  private updatePageDatas(): void {
    this.albumService.detailCategoryPageInfo(this.searchParams).subscribe(
      value => {
        this.categoryInfo = value;
        this.cdr.markForCheck();
      }
    );
  }

  changeSubCategory(item?: SubCategory) {
    if (this.searchParams.subcategory !== item?.code) {
      this.categoryService.setSubCategory([item?.displayValue!]);
      this.searchParams.subcategory = item?.code || '';
      this.updatePageDatas();
    }
  }

  changeMate(row: MetaData, item: MetaValue) {
    this.checkedMetas.push({
      metaRowId: row.id,
      metaRowName: row.name,
      metaId: item.id,
      metaName: item.displayName,
    });

    this.getSearchParamsMate();
  }

  showMateRow(name: string) {
    if (this.checkedMetas.length) {
      return this.checkedMetas.findIndex(item => item.metaRowName === name) === -1;
    }
    return true;
  }

  unCheckMate(item: CheckedMeta | 'clear') {
    if (item === 'clear') {
      this.checkedMetas = [];
      this.searchParams.meta = '';
    } else {
      const index = this.checkedMetas.findIndex(value => {
        return item.metaRowId === value.metaRowId && item.metaId === value.metaId;
      });
      if (index > -1) {
        this.checkedMetas.splice(index, 1);
        this.searchParams.meta = this.getSearchParamsMate();
      }
    }
  }

  private getSearchParamsMate(): string {
    let result = '';
    this.checkedMetas.forEach(value => {
      result += value.metaRowId + '_' + value.metaId + '-';
    });
    // console.log('result', result.slice(0, -1));
    return result.slice(0, -1);
  }
}
