import { Injectable } from '@angular/core';
import {User} from './types';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContextService {

  user = new Subject<User | null>();

  constructor() { }

  setUser(user: User | null) {
    this.user.next(user);
  }

  getUser() {
    return this.user.asObservable();
  }
}
