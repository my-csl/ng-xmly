import {Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, EventEmitter} from '@angular/core';
import {XmMessageItemData, XmMessageOptions} from './types';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessageComponent implements OnInit {

  messages: XmMessageItemData[] = [];
  readonly defaultOptions: Required<XmMessageOptions> = {
    type: 'info',
    duration: 3000,
    showClose: false,
    pauseOnHover: true,
    maxStack: 5,
    animate: true
  };
  empty = new EventEmitter<void>();

  constructor(private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
  }

  createMessage(message: XmMessageItemData): void {
    message.options = {...this.defaultOptions, ...message.options};
    const maxStack = message.options.maxStack;
    if (maxStack && this.messages.length >= maxStack) {
      this.removeMessage(this.messages[0].messageId);
    }
    this.messages.push(message);
    this.cdr.markForCheck();
  }

  removeMessage(id: string) {
    const targetIndex = this.messages.findIndex(item => item.messageId === id);
    if (targetIndex > -1) {
      this.messages[targetIndex].onClose.next();
      this.messages.splice(targetIndex, 1);
      this.cdr.markForCheck();
    }
    if (this.messages.length === 0) {
      this.empty.emit();
    }
  }

}
