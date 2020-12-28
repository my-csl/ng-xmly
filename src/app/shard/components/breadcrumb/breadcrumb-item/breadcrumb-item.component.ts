import {Component, OnInit, ChangeDetectionStrategy, Input, TemplateRef} from '@angular/core';
import {BreadcrumbComponent} from '../breadcrumb.component';

@Component({
  selector: 'app-breadcrumb-item',
  templateUrl: './breadcrumb-item.component.html',
  styleUrls: ['./breadcrumb-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BreadcrumbItemComponent implements OnInit {

  myContext = {$implicit: 'World', my: 'stiv'}

  constructor(readonly parent: BreadcrumbComponent) { }

  ngOnInit(): void {
  }

}
