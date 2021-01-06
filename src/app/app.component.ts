import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AlbumService} from './services/apis/album.service';
import {Category} from './services/apis/types';
import {CategoryService} from './services/business/category.service';
import {Router} from '@angular/router';
import {combineLatest} from 'rxjs';

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
    private albumService: AlbumService,
    private cdr: ChangeDetectorRef,
    private categoryService: CategoryService,
    private router: Router
  ) {

  }

  ngOnInit(): void {
    this.init();
  }

  private init(): void {
    combineLatest(
      this.categoryService.getCategory(),
      this.categoryService.getSubCategory()
    ).subscribe(
      ([category, subcategory]) => {
        if (category !== this.categoryPinyin) {
          this.categoryPinyin = category;
          if (this.categories.length) {
            this.currentCategory = this.categories.find(item => item.pinyin === this.categoryPinyin);
          }
        }
        this.subcategory = subcategory;
      }
    );
    this.getCategories();
  }

  private getCategories(): void {
    this.albumService.categories().subscribe(categories => {
      this.categories = categories;
      this.currentCategory = this.categories.find(item => item.pinyin === this.categoryPinyin);
      this.cdr.markForCheck();
    });
  }

  changeCategory(item: Category) {
    this.currentCategory = this.categories.find(category => category.pinyin === item.pinyin);
    // this.categoryService.setCategory(this.currentCategory?.pinyin!);
    this.router.navigateByUrl(`/albums/${this.currentCategory?.pinyin!}`);
    this.cdr.markForCheck();
  }
}
