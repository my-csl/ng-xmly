import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AlbumService} from './services/apis/album.service';
import {AlbumInfo, Category, Track} from './services/apis/types';
import {CategoryService} from './services/business/category.service';
import {Router} from '@angular/router';
import {combineLatest} from 'rxjs';
import {WindowService} from './services/tools/window.service';
import {ContextService} from './services/business/context.service';
import {storageKeys} from './configs';
import {UserService} from './services/apis/user.service';
import {MessageService} from './shard/components/message/message.service';
import {PlayerService} from './services/business/player.service';
import {animate, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('fadePlayer', [
      transition(':enter', [
        style({
          opacity: 0
        }),
        animate('.3s')
      ]),
      transition(':leave', [
        animate('.3s', style({
          opacity: 0
        }))
      ])
    ])
  ]
})
export class AppComponent implements OnInit {

  currentCategory: Category | undefined;
  categories: Category[] = [];
  categoryPinyin: string = '';
  subcategory: string[] = [];
  showLogin = false;
  showPlayer = false;
  playInfo: {
    trackList: Track[],
    currentTrackIndex: number,
    currentTrack: Track | null,
    album: AlbumInfo | null,
    playing: boolean,
  };

  constructor(
    private albumService: AlbumService,
    private cdr: ChangeDetectorRef,
    private categoryService: CategoryService,
    private router: Router,
    private windowService: WindowService,
    private contextService: ContextService,
    private userService: UserService,
    private messageService: MessageService,
    private playerService: PlayerService
  ) {

  }

  ngOnInit(): void {
    if (this.windowService.getStorage(storageKeys.remember)) {
      this.userService.getUserInfo().subscribe(({user, token}) => {
        this.contextService.setUser(user);
        this.windowService.setStorage(storageKeys.auth, token);
      }, error => {
        console.error(error);
        this.clearStorage();
      });
    }
    this.init();
    this.watchPlayer();
  }

  private watchPlayer() {
    combineLatest(
      this.playerService.getTrackList(),
      this.playerService.getCurrentTrackIndex(),
      this.playerService.getCurrentTrack(),
      this.playerService.getAlbum(),
      this.playerService.getPlaying()
    ).subscribe(([trackList, currentTrackIndex, currentTrack, album, playing]) => {
      this.playInfo = {
        trackList,
        currentTrackIndex,
        currentTrack,
        album,
        playing
      };
      if (trackList.length) {
        this.showPlayer = true;
        this.cdr.markForCheck();
      }
    });
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
    // this.currentCategory = this.categories.find(category => category.pinyin === item.pinyin);
    // this.categoryService.setCategory(this.currentCategory?.pinyin!);
    this.router.navigateByUrl(`/albums/${item.pinyin}`);
    this.cdr.markForCheck();
  }

  logout() {
    this.userService.logout().subscribe(() => {
      this.contextService.setUser(null);
      this.clearStorage();
      this.messageService.success('退出成功');
    });
  }

  private clearStorage() {
    this.windowService.removeStorage(storageKeys.auth);
    this.windowService.removeStorage(storageKeys.remember);
  }

  close() {
    this.playerService.clear();
    this.showPlayer = false;
  }
}
