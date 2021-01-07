import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AlbumArgs, AlbumService, AlbumsInfo, CategoryInfo} from '../../services/apis/album.service';
import {MetaData, MetaValue, SubCategory} from '../../services/apis/types';
import {CategoryService} from '../../services/business/category.service';
import {ActivatedRoute} from '@angular/router';
import {withLatestFrom} from 'rxjs/operators';
import {forkJoin} from 'rxjs';
import {WindowService} from '../../services/tools/window.service';
import {storageKeys} from '../../configs';

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
    perPage: 35
  };
  categoryInfo: CategoryInfo | undefined;
  checkedMetas: CheckedMeta[] = [];
  albumsInfo: AlbumsInfo | undefined;
  sorts = ['综合排序', '最近更新', '播放最多'];
  total = 0;

  constructor(
    private albumService: AlbumService,
    private cdr: ChangeDetectorRef,
    private categoryService: CategoryService,
    private activatedRoute: ActivatedRoute,
    private windowService: WindowService
  ) {
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.pipe(
      withLatestFrom(this.categoryService.getCategory())
    ).subscribe(
      ([paramMap, category]) => {
        const pinyin = paramMap.get('pinyin');
        this.searchParams.category = pinyin!;
        let needSetStatus = false;
        if (pinyin !== category) {
          this.categoryService.setCategory(pinyin!);
          this.searchParams.page = 1;
          this.clearSubCategory();
          this.unCheckMate('clear');
        } else {
          const subCategory = this.windowService.getStorage(storageKeys.subcategoryCode);
          const metas = this.windowService.getStorage(storageKeys.metas);
          // const pageNum = this.windowService.getStorage(storageKeys.pageNum);
          if (subCategory) {
            needSetStatus = true;
            this.searchParams.subcategory = subCategory;
          } else {
            this.clearSubCategory();
          }
          if (metas) {
            needSetStatus = true;
            this.searchParams.meta = metas;
          }
          // if (pageNum) {
          //   this.searchParams.page = +pageNum;
          // }
        }
        this.updatePageDatas(needSetStatus);
      }
    );
  }

  private updatePageDatas(needSetStatus = false): void {
    forkJoin(
      this.albumService.getAlbums(this.searchParams),
      this.albumService.detailCategoryPageInfo(this.searchParams)
    ).subscribe(
      ([albumsInfo, categoryInfo]) => {
        this.albumsInfo = albumsInfo;
        this.total = albumsInfo.total;
        this.categoryInfo = categoryInfo;
        if (needSetStatus) {
          this.initStatus(categoryInfo);
        }
        this.cdr.markForCheck();
      }
    );
  }

  changeSubCategory(item?: SubCategory) {
    if (item) {
      if (this.searchParams.subcategory !== item?.code) {
        this.searchParams.page = 1;
        // this.windowService.removeStorage(storageKeys.pageNum);
        this.categoryService.setSubCategory([item?.displayValue!]);
        this.searchParams.subcategory = item?.code!;
        this.windowService.setStorage(storageKeys.subcategoryCode, item?.code!);
      }
    } else {
      this.clearSubCategory();
    }
    this.unCheckMate('clear');
    this.updatePageDatas();
  }

  changeMate(row: MetaData, item: MetaValue) {
    this.checkedMetas.push({
      metaRowId: row.id,
      metaRowName: row.name,
      metaId: item.id,
      metaName: item.displayName,
    });
    this.searchParams.meta = this.getSearchParamsMate();
    this.windowService.setStorage(storageKeys.metas, this.searchParams.meta);
    this.getAlbums();
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
      this.windowService.removeStorage(storageKeys.metas);
      this.getAlbums();
    } else {
      const index = this.checkedMetas.findIndex(value => {
        return item.metaRowId === value.metaRowId && item.metaId === value.metaId;
      });
      if (index > -1) {
        this.checkedMetas.splice(index, 1);
        this.searchParams.meta = this.getSearchParamsMate();
        this.windowService.setStorage(storageKeys.metas, this.searchParams.meta);
        this.getAlbums();
      }
    }
  }

  private getSearchParamsMate(): string {
    let result = '';
    this.checkedMetas.forEach(value => {
      result += value.metaRowId + '_' + value.metaId + '-';
    });
    return result.slice(0, -1);
  }

  changeSort(index: number) {
    if (this.searchParams.sort !== index) {
      this.searchParams.sort = index;
      this.getAlbums();
    }
  }

  private getAlbums() {
    this.albumService.getAlbums(this.searchParams).subscribe(
      albumsInfo => {
        this.albumsInfo = albumsInfo;
        this.total = albumsInfo.total;
        this.cdr.markForCheck();
      }
    );
  }

  private clearSubCategory(): void {
    this.searchParams.subcategory = '';
    this.windowService.removeStorage(storageKeys.pageNum);
    this.categoryService.setSubCategory([]);
    this.windowService.removeStorage(storageKeys.subcategoryCode);
  }

  private initStatus({metadata, subcategories}: CategoryInfo) {
    const subCategory = subcategories.find(item => item.code === this.searchParams.subcategory);
    if (subCategory) {
      this.categoryService.setSubCategory([subCategory.displayValue]);
    }
    if (this.searchParams.meta) {
      const metasMap = this.searchParams.meta.split('-').map(item => item.split('_'));
      metasMap.forEach(meta => {
        const targetRow = metadata.find(row => row.id === Number(meta[0]));
        const {id: metaRowId, name, metaValues} = targetRow || metadata[0];
        const targetMeta = metaValues.find(item => item.id === Number(meta[1]));
        const {id, displayName} = targetMeta || metaValues[0];
        this.checkedMetas.push({
          metaRowId,
          metaRowName: name,
          metaId: id,
          metaName: displayName
        });
      });
    }
  }

  changePage(page: number) {
    if (this.searchParams.page !== page) {
      this.searchParams.page = page;
      // this.windowService.setStorage(storageKeys.pageNum, page.toString());
      this.getAlbums();
    }
  }
}
