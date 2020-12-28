import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AlbumArgs, AlbumService, CategoryInfo} from '../../services/apis/album.service';
import {SubCategory} from '../../services/apis/types';
import {CategoryService} from '../../services/business/category.service';
import {ActivatedRoute, Router} from '@angular/router';
import {combineLatest} from 'rxjs';

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

  constructor(
    private albumService: AlbumService,
    private cdr: ChangeDetectorRef,
    private categoryService: CategoryService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    combineLatest(this.activatedRoute.paramMap, this.categoryService.getCategory()).subscribe(
      ([paramMap, category]) => {
        const pinyin = paramMap.get('pinyin');
        if (pinyin === category) {
          this.searchParams.category = pinyin;
          this.updatePageDatas();
        } else {
          this.categoryService.setCategory(pinyin!);
          this.router.navigateByUrl('/albums/' + pinyin);
        }
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
      this.searchParams.subcategory = item?.code || '';
      this.updatePageDatas();
    }
  }
}
