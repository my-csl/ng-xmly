import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Base, User} from './types';
import {environment} from '../../../environments/environment';
import {map} from 'rxjs/operators';
import {storageKeys} from '../../configs';

interface LoginRes {
  user: User,
  token: string
}

const needToken = new HttpHeaders().set(storageKeys.needToken, 'true');

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly priFix = '/xmly/';

  constructor(private http: HttpClient) {
  }

  login(params: Exclude<User, 'name'>): Observable<LoginRes> {
    return this.http
      .post(`${environment.baseUrl}${this.priFix}login`, params)
      .pipe(
        // @ts-ignore
        map((res: Base<LoginRes>) => res.data)
      );
  }

  getUserInfo(): Observable<LoginRes> {
    return this.http
      .get(`${environment.baseUrl}${this.priFix}account`, {
        headers: needToken
      })
      .pipe(
        // @ts-ignore
        map((res: Base<LoginRes>) => res.data)
      );
  }

  logout(): Observable<void> {
    return this.http
      .get(`${environment.baseUrl}${this.priFix}logout`, {
        headers: needToken
      })
      .pipe(
        // @ts-ignore
        map((res: Base<void>) => res.data)
      );
  }
}
