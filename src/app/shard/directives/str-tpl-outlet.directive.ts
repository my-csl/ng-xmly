import {Directive, Input, OnChanges, SimpleChanges, TemplateRef, ViewContainerRef} from '@angular/core';

@Directive({
  selector: '[appStrTplOutlet]'
})
export class StrTplOutletDirective implements OnChanges {

  @Input() appStrTplOutlet: TemplateRef<any> | string;
  @Input() appStrTplOutletContext: any;

  constructor(private viewContainerRef: ViewContainerRef, private templateRef: TemplateRef<any>) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    const {appStrTplOutlet} = changes;
    if (appStrTplOutlet) {
      this.viewContainerRef.clear();
      const template = (this.appStrTplOutlet instanceof TemplateRef) ? this.appStrTplOutlet : this.templateRef;
      this.viewContainerRef.createEmbeddedView(template, this.appStrTplOutletContext);
    }
  }

}
