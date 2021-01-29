import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef, Input, OnChanges,
  OnInit, Output,
  Renderer2, SimpleChanges,
  ViewChild,
  EventEmitter, Inject, PLATFORM_ID
} from '@angular/core';
import {EMPTY, fromEvent, merge, of, Subscription, timer} from 'rxjs';
import {pluck, switchMap} from 'rxjs/operators';
import {OverlayRef, OverlayService} from '../../services/tools/overlay.service';
import {AbstractControl, FormBuilder, ValidationErrors, Validators} from '@angular/forms';
import {DOCUMENT, isPlatformBrowser} from '@angular/common';
import {animate, AnimationEvent, style, transition, trigger} from '@angular/animations';
import {UserService} from '../../services/apis/user.service';
import {WindowService} from '../../services/tools/window.service';
import {storageKeys} from '../../configs';
import {ContextService} from '../../services/business/context.service';
import {MessageService} from '../../shard/components/message/message.service';

interface FromControls {
  phone: FromControl,
  password: FromControl
}

interface FromControl {
  control: AbstractControl,
  showErr: boolean,
  error: ValidationErrors
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('loginAni', [
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'translateY(100%)'
        }),
        animate('.2s')
      ]),
      transition(':leave', [
        animate('.3s', style({
          opacity: 0,
          transform: 'translateY(-100%)'
        }))
      ])
    ])
  ]
})
export class LoginComponent implements OnInit, OnChanges, AfterViewInit {

  private overlayRef: OverlayRef;
  private subscription: Subscription;
  @ViewChild('modalWrap') modalWrap: ElementRef;
  formValues = this.fb.group({
    phone: ['15179773914', [
      Validators.required,
      Validators.pattern(/^1\d{10}$/)
    ]],
    password: ['angular11', [
      Validators.required,
      Validators.minLength(6)
    ]]
  });
  @Input() show = false;
  @Output() hide = new EventEmitter<void>();
  visible = false;
  remember = true;

  constructor(
    private overlayService: OverlayService,
    private rd2: Renderer2,
    private el: ElementRef,
    private fb: FormBuilder,
    private userService: UserService,
    private contextService: ContextService,
    private windowService: WindowService,
    private messageService: MessageService,
    @Inject(PLATFORM_ID) private platformId: object,
  ) {
  }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.show) {
      this.showOverlay();
    } else {
      this.visible = false;
    }
  }

  showOverlay() {
    if (isPlatformBrowser(this.platformId)) {
      this.overlayRef = this.overlayService.create({fade: true, center: true, backgroundColor: 'rgba(0,0,0,.32)'});
      this.subscription = merge(
        this.overlayRef.backdropClick(),
        this.overlayRef.backdropKeyup().pipe(
          pluck('key'),   // 提取对象的属性
          switchMap(key => {
            return key.toLocaleUpperCase() === 'ESCAPE' ? of(key) : EMPTY;
          })
        )
      ).subscribe(() => {
          this.hide.emit();
        }
      );
      this.visible = true;
      timer(0).subscribe(() => {
        this.rd2.appendChild(this.overlayRef.container, this.modalWrap.nativeElement);
      });
    }
  }

  private hideOverlay() {
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.subscription.unsubscribe();
    }
  }

  animationsDone(event: AnimationEvent) {
    if (event.toState === 'void') {
      this.hideOverlay();
    }
  }

  submit() {
    if (this.formValues.valid) {
      this.userService.login(this.formValues.value).subscribe(({user, token}) => {
        this.contextService.setUser(user);
        this.windowService.setStorage(storageKeys.auth, token);
        if (this.remember) {
          this.windowService.setStorage(storageKeys.remember, 'true');
        }
        this.hide.emit();
        this.messageService.success('登录成功');
      });
    }
  }

  get fromControls() {
    const controls = {
      phone: this.formValues.get('phone'),
      password: this.formValues.get('password'),
    };
    return <FromControls> {
      phone: {
        control: controls.phone,
        showErr: controls.phone?.invalid && controls.phone.touched,
        error: controls.phone?.errors
      },
      password: {
        control: controls.password,
        showErr: controls.password?.invalid && controls.password.touched,
        error: controls.password?.errors
      }
    };
  }
}
