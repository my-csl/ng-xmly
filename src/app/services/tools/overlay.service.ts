import {Inject, Injectable, PLATFORM_ID, Renderer2, RendererFactory2} from '@angular/core';
import {DOCUMENT, isPlatformBrowser} from '@angular/common';
import {fromEvent, merge, Observable, Subject, timer} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

export interface OverlayRef {
  container: HTMLElement;
  backdropClick: () => Observable<MouseEvent>;
  backdropKeyup: () => Observable<KeyboardEvent>;
  dispose: () => void;
}

export interface OverlayConfig {
  content?: boolean;
  fade?: boolean;
  backgroundColor?: string;
  responseEvent?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class OverlayService {

  private rd2: Renderer2;
  private config: Required<OverlayConfig>;
  private overlayRef: OverlayRef;
  private backdropElement: HTMLElement;
  private datachment$ = new Subject<void>(); //取消监听
  private backdropClick$ = new Subject<MouseEvent>();
  private backdropKeyup$ = new Subject<KeyboardEvent>();
  readonly defaultConfig: Required<OverlayConfig> = {
    content: false,
    fade: false,
    backgroundColor: 'transparent',
    responseEvent: true
  };

  constructor(
    private rd2Factory: RendererFactory2,
    @Inject(DOCUMENT) private doc: Document,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    // 在服务中要使用Renderer2要使用它的工厂方法去创建
    this.rd2 = this.rd2Factory.createRenderer(null, null);
  }

  create(config?: OverlayConfig): OverlayRef {
    if (isPlatformBrowser(this.platformId)) {
      this.config = {...this.defaultConfig, ...config};
      const container = this.rd2.createElement(`div`);
      this.rd2.addClass(container, 'overlay-container');
      container.innerHTML = `<div class="overlay-mask"></div>`;
      this.backdropElement = container.querySelector('.overlay-mask');
      this.rd2.appendChild(this.doc.body, container);
      this.setConfigs(container);
      this.overlayRef = {
        container: container,
        backdropClick: this.backdropClick.bind(this),
        backdropKeyup: this.backdropKeyup.bind(this),
        dispose: this.dispose.bind(this)
      };
    }
    return this.overlayRef;
  }

  private dispose() {
    if (this.overlayRef) {
      if (this.config.fade) {
        fromEvent(this.backdropElement, 'transitionend').pipe(
          takeUntil(this.datachment$)
        ).subscribe(() => {
          this.destroy();
        });
        this.rd2.removeClass(this.backdropElement, 'overlay-mask-show');
      } else {
        this.destroy();
      }

    }
  }

  private destroy() {
    this.datachment$.next();
    this.datachment$.complete();
    this.rd2.removeChild(this.doc.body, this.overlayRef.container);
  }

  private backdropClick(): Observable<MouseEvent> {
    return this.backdropClick$.asObservable();
  }

  private backdropKeyup(): Observable<KeyboardEvent> {
    return this.backdropKeyup$.asObservable();
  }

  private linsnerEvent() {
    merge(
      fromEvent(this.doc, 'keyup'),
      fromEvent(this.backdropElement, 'click')
    ).pipe(
      takeUntil(this.datachment$)
      // @ts-ignore
    ).subscribe((event: MouseEvent | KeyboardEvent) => {
      if (event instanceof MouseEvent) {
        this.backdropClick$.next(event);
      } else {
        this.backdropKeyup$.next(event);
      }
    });
  }

  private setConfigs(container: HTMLElement) {
    const {content, fade, backgroundColor, responseEvent} = this.config;
    if (content) {
      this.rd2.addClass(container, 'overlay-content');
    }
    if (backgroundColor) {
      this.rd2.setStyle(this.backdropElement, 'background-color', backgroundColor);
    }
    if (fade) {
      timer(0).subscribe(() => {
        this.rd2.addClass(this.backdropElement, 'overlay-mask-show');
      });
    } else {
      this.rd2.addClass(this.backdropElement, 'overlay-mask-show');
    }
    if (responseEvent) {
      this.rd2.setStyle(this.backdropElement, 'pointer-events', 'auto');
      this.linsnerEvent();
    }
  }
}
