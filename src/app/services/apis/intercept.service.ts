import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {WindowService} from '../tools/window.service';
import {storageKeys} from '../../configs';
import {catchError} from 'rxjs/operators';

@Injectable()
export class InterceptService implements HttpInterceptor {

  constructor(private windowsService: WindowService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const auth = this.windowsService.getStorage(storageKeys.auth);
    const needToken = req.headers.get(storageKeys.needToken);
    let headerConfig = {};
    if (needToken) {
      headerConfig = {headers: req.headers.set(storageKeys.auth, auth || '')};
    }
    return next.handle(req.clone(headerConfig)).pipe(catchError(err => handleError(err)));
  }
}

function handleError(err: HttpErrorResponse): Observable<never> {
  if (typeof err.error.ret === 'number') {
    alert(err.error.message || '请求失败');
  } else {
    alert('请求失败');
  }
  return throwError(err);
}
