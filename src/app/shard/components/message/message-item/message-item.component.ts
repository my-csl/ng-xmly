import {Component, OnInit, ChangeDetectionStrategy, Input, OnDestroy, ChangeDetectorRef} from '@angular/core';
import {XmMessageItemData} from '../types';
import {MessageComponent} from '../message.component';
import {Subscription, timer} from 'rxjs';
import {animate, style, transition, trigger, AnimationEvent} from '@angular/animations';

@Component({
  selector: 'app-message-item',
  templateUrl: './message-item.component.html',
  styleUrls: ['./message-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('messageAnimation', [
      transition('* => enter', [
        style({
          opacity: 0,
          transform: 'translateY(-100%)'
        }),
        animate('.3s')
      ]),
      transition('* => leave', [
        animate('.3s', style({
          opacity: 0,
          transform: 'translateY(-100%)'
        }))
      ])
    ])
  ]
})
export class MessageItemComponent implements OnInit, OnDestroy {

  @Input() index = 0;
  @Input() message: XmMessageItemData;
  private timerSub: Subscription;
  private autoClose: boolean;

  constructor(private parent: MessageComponent, private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    const {duration} = this.message.options!;
    this.autoClose = duration! > 0;
    if (this.autoClose) {
      this.createTimer(duration!);
    }
  }

  private clearTimer(): void {
    if (this.timerSub) {
      this.timerSub.unsubscribe();
    }
  }

  private createTimer(duration: number): void {
    this.timerSub = timer(duration).subscribe(() => {
      this.onClose();
    });
  }

  get messageCls() {
    return `xm-message clearfix ${this.message.options?.type}`;
  }

  onClose() {
    this.message.state = 'leave';
    this.cdr.markForCheck();
  }

  enter() {
    if (this.timerSub && this.message.options?.pauseOnHover) {
      this.clearTimer();
    }
  }

  leave() {
    if (this.timerSub) {
      this.createTimer(this.message.options?.duration!);
    }
  }

  ngOnDestroy(): void {
    if (this.timerSub) {
      this.clearTimer();
    }
  }

  animationDone(event: AnimationEvent) {
    if (event.toState === 'leave') {
      this.parent.removeMessage(this.message.messageId);
    }
  }
}
