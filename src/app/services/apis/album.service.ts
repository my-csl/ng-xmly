import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Album, AlbumInfo, Anchor, Base, Category, MetaData, RelateAlbum, SubCategory, TrackAudio, TracksInfo} from './types';
import {environment} from '../../../environments/environment';
import {map} from 'rxjs/operators';
// @ts-ignore
import {stringify} from 'querystring';

export interface CategoryInfo {
  category: Category;
  currentSubcategory: SubCategory;
  subcategories: SubCategory[];
  metadata: MetaData[];
}

export interface AlbumsInfo {
  albums: Album[];
  page: number;
  pageSize: number;
  total: number;
  pageConfig: { h1title: string };
}

export interface AlbumArgs {
  category: string;
  subcategory: string;
  meta: string;
  sort: number;
  page: number;
  perPage: number;
}

export interface AlbumRes {
  albumId: number;
  mainInfo: AlbumInfo;
  anchorInfo: Anchor;
  tracksInfo: TracksInfo;
}

export interface AlbumTrackArgs {
  albumId: string;
  sort: number;
  pageNum: number;
  pageSize: number;
}

@Injectable({
  providedIn: 'root'
})
export class AlbumService {

  readonly prefix = '/xmly/';

  constructor(private http: HttpClient) {
  }

  // 一级分类列表
  categories(categoryId = 3): Observable<Category[]> {
    const params = new HttpParams().set('categoryId', categoryId.toString());
    return this.http
      .get(`${environment.baseUrl}${this.prefix}breadcrumb`, {params})
      .pipe(
        // @ts-ignore
        map((res: Base<{ categories: Category[] }>) => res.data.categories)
      );
  }

  // 二、三级分类列表
  detailCategoryPageInfo(args: Pick<AlbumArgs, 'category' | 'subcategory'>): Observable<CategoryInfo> {
    return this.http
      .get(`${environment.baseUrl}${this.prefix}categories`, {params: args})
      .pipe(
        // @ts-ignore
        map((res: Base<CategoryInfo>) => res.data)
      );
  }

  // 专辑列表
  getAlbums(args: AlbumArgs): Observable<AlbumsInfo> {
    const params = new HttpParams({fromString: stringify(args)});
    return this.http
      .get(`${environment.baseUrl}${this.prefix}albums`, {params})
      .pipe(
        // @ts-ignore
        map((res: Base<AlbumsInfo>) => res.data)
      );
  }

  // 专辑详情
  getAlbum(albumId: string): Observable<AlbumRes> {
    const params = new HttpParams().set('albumId', albumId);
    return this.http
      .get(`${environment.baseUrl}${this.prefix}album`, {params})
      .pipe(
        // @ts-ignore
        map((res: Base<AlbumRes>) => res.data)
      );
  }

  // 专辑评分
  getAlbumScore(albumId: string): Observable<number> {
    return this.http
      .get(`${environment.baseUrl}${this.prefix}album-score/${albumId}`)
      .pipe(
        // @ts-ignore
        map((res: Base<{ albumScore: number }>) => res.data.albumScore || 0)
      );
  }

  // 相关专辑列表
  getRelateAlbums(id: string): Observable<RelateAlbum[]> {
    const params = new HttpParams().set('id', id);
    return this.http
      .get(`${environment.baseUrl}${this.prefix}album-relate`, {params})
      .pipe(
        // @ts-ignore
        map((res: Base<{ hotWordAlbums: RelateAlbum[] }>) => res.data.hotWordAlbums)
      );
  }

  // 专辑播放列表
  getTracks(args: AlbumTrackArgs): Observable<TracksInfo> {
    const params = new HttpParams({fromString: stringify(args)});
    return this.http
      .get(`${environment.baseUrl}${this.prefix}album-tracks`, {params})
      .pipe(
        // @ts-ignore
        map((res: Base<TracksInfo>) => res.data)
      )
  }

  // 播放地址
  trackAudio(id: number): Observable<TrackAudio> {
    return this.http
      .get(`${environment.baseUrl}${this.prefix}album-track-url/${id}`)
      .pipe(
        // @ts-ignore
        map((res: Base<TrackAudio>) => res.data)
      );
  }

}
