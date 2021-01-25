import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {WindowService} from '../tools/window.service';
import {storageKeys} from '../../configs';
import {catchError} from 'rxjs/operators';
import {MessageService} from '../../shard/components/message/message.service';

@Injectable()
export class InterceptService implements HttpInterceptor {

  constructor(private windowsService: WindowService, private messageService: MessageService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const auth = this.windowsService.getStorage(storageKeys.auth);
    const needToken = req.headers.get(storageKeys.needToken);
    let headerConfig = {};
    if (needToken) {
      headerConfig = {headers: req.headers.set(storageKeys.auth, auth || '')};
    }
    return next.handle(req.clone(headerConfig)).pipe(catchError(err => this.handleError(err)));
  }

  private handleError(err: HttpErrorResponse): Observable<never> {
    if (typeof err.error.ret === 'number') {
      this.messageService.error(err.error.message || '请求失败');
    } else {
      this.messageService.error('请求失败');
    }
    return throwError(err);
  }

}
