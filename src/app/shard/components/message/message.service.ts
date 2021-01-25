import {
  ApplicationRef,
  ComponentFactoryResolver,
  ComponentRef,
  Inject,
  Injectable,
  Injector,
  Renderer2,
  RendererFactory2, TemplateRef
} from '@angular/core';
import {MessageModule} from './message.module';
import {MessageComponent} from './message.component';
import {DOCUMENT} from '@angular/common';
import {uniqueId} from 'lodash';
import {Subject} from 'rxjs';
import {XmMessageItemData, XmMessageOptions} from './types';

@Injectable({
  providedIn: MessageModule
})
export class MessageService {

  private message: MessageComponent | null;
  private componentRef: ComponentRef<MessageComponent>;
  private rd2: Renderer2;

  constructor(
    @Inject(DOCUMENT) private doc: Document,
    private rd2Factory: RendererFactory2,
    private cfr: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector
  ) {
    this.rd2 = this.rd2Factory.createRenderer(null, null);
  }

  info(content: string | TemplateRef<void>, options?: XmMessageOptions): XmMessageItemData {
    return this.create(content, {...options, type: 'info'});
  }

  success(content: string | TemplateRef<void>, options?: XmMessageOptions): XmMessageItemData {
    return this.create(content, {...options, type: 'success'});
  }

  warning(content: string | TemplateRef<void>, options?: XmMessageOptions): XmMessageItemData {
    return this.create(content, {...options, type: 'warning'});
  }

  error(content: string | TemplateRef<void>, options?: XmMessageOptions): XmMessageItemData {
    return this.create(content, {...options, type: 'error'});
  }

  private create(content: string | TemplateRef<void>, options?: XmMessageOptions): XmMessageItemData {
    if (!this.message) {
      this.message = this.getMessage();
    }
    const message: XmMessageItemData = {
      messageId: uniqueId('message-'),
      content,
      onClose: new Subject<void>(),
      options,
      state: 'enter'
    };
    this.message.createMessage(message);
    return message;
  }

  private getMessage(): MessageComponent {
    // 创建组件工厂
    const factory = this.cfr.resolveComponentFactory(MessageComponent);
    // 创建组件
    this.componentRef = factory.create(this.injector);
    // 加入到变更检测树中
    this.appRef.attachView(this.componentRef.hostView);
    // 添加到页面
    this.rd2.appendChild(this.doc.body, this.componentRef.location.nativeElement);
    // 返回组件实例
    const {instance} = this.componentRef;
    this.componentRef.onDestroy(() => {
      console.log('已销毁');
    });
    instance.empty.subscribe(() => {
      this.destroy();
    });
    return instance;
  }

  private destroy() {
    this.componentRef.destroy();
    this.message = null;
  }
}
