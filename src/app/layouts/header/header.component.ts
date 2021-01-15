import {
  Component,
  EventEmitter,
  OnInit,
  ChangeDetectionStrategy,
  Inject,
  ElementRef,
  ChangeDetectorRef,
  AfterViewInit,
  Output
} from '@angular/core';
import {User} from '../../services/apis/types';
import {DOCUMENT} from '@angular/common';
import {fromEvent} from 'rxjs';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('changeHeader', [
      state('true', style({
        position: 'fixed',
        top: 0,
        width: '100%',
        zIndex: 1,
      })),
      transition('* => true', [
        style({
          transform: 'translateY(-100%)',
          opacity: 0
        }),
        animate('300ms ease-in-out')
      ])
    ])
  ]
})
export class HeaderComponent implements OnInit, AfterViewInit {

  user: User | undefined;
  fix = false;
  @Output() showLogin = new EventEmitter<void>();

  constructor(
    @Inject(DOCUMENT) private doc: Document,
    private el: ElementRef,
    private cdr: ChangeDetectorRef
  ) {
  }

  ngAfterViewInit(): void {
    fromEvent(this.doc, 'scroll')
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => {
        const top = this.doc.documentElement.scrollTop;
        const clientHeight = this.el.nativeElement.clientHeight;
        if (top > clientHeight + 100) {
          this.fix = true;
        } else if (top === 0) {
          this.fix = false;
        }
        this.cdr.markForCheck();
      });
  }

  ngOnInit(): void {
  }

}
