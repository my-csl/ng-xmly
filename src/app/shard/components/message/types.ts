import {Subject} from 'rxjs';
import {TemplateRef} from '@angular/core';

export type XmMessageType = 'success' | 'info' | 'warning' | 'error';

export interface XmMessageOptions {
  type?: XmMessageType;
  duration?: number; // 多少秒后消失
  showClose?: boolean;
  pauseOnHover?: boolean;
  maxStack?: number,
  animate?: boolean
}

export interface XmMessageItemData {
  messageId: string;
  content: string | TemplateRef<void>;
  onClose: Subject<void>;
  options?: XmMessageOptions,
  state: 'enter' | 'leave',
}
