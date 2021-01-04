import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class WindowService {

  readonly isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  setStorage(key: string, value: string) {
    if (this.isBrowser) {
      localStorage.setItem(key, value);
    }
  }

  getStorage(key: string) {
    if (this.isBrowser) {
      return localStorage.getItem(key);
    }
    return null;
  }

  removeStorage(key: string) {
    if (this.isBrowser) {
      localStorage.removeItem(key);
    }
  }

  clearStorage() {
    if (this.isBrowser) {
      localStorage.clear();
    }
  }
}
