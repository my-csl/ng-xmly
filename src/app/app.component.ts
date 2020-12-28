import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AlbumService} from './services/apis/album.service';
import {Category} from './services/apis/types';
import {CategoryService} from './services/business/category.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {

  currentCategory: Category | undefined;
  categories: Category[] = [];
  categoryPinyin: string = '';
  subcategory: string[] = [];

  constructor(
    private albymService: AlbumService,
    private cdr: ChangeDetectorRef,
    private categoryService: CategoryService,
    private router: Router
  ) {

  }

  ngOnInit(): void {
    this.init();
  }

  private init(): void {
    this.categoryService.getCategory().subscribe(
      category => {
        if (category !== this.categoryPinyin) {
          this.categoryPinyin = category;
          if (this.categories.length) {
            this.currentCategory = this.categories.find(item => item.pinyin === this.categoryPinyin);
          } else {
            this.getCategories();
          }
        }
      }
    )
  }

  private getCategories(): void {
    this.albymService.categories().subscribe(value => {
      this.categories = value;
      this.currentCategory = this.categories.find(item => item.pinyin === this.categoryPinyin);
      this.cdr.markForCheck();
    });
  }

  changeCategory(item: Category) {
    this.currentCategory = this.categories.find(res => res.pinyin === item.pinyin);
    this.categoryService.setCategory(item.pinyin);
    this.router.navigateByUrl(`/albums/${item.pinyin}`);
    this.cdr.markForCheck();
  }
}
