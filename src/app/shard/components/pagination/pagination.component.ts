import {Component, Input, OnChanges, OnInit, Output, SimpleChanges, EventEmitter} from '@angular/core';
import {clamp} from 'lodash';

type PageType = 'page' | 'prev' | 'next' | 'prev5' | 'next5';

interface PageItem {
  type: PageType;
  disable?: boolean;
  num?: number;
}

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit, OnChanges {

  @Input() total = 0; // 总条数
  @Input() pageNum = 1; // 当前页码
  @Input() pageSize = 10; // 每页显示数量
  @Output() change = new EventEmitter<number>();

  lastNum = 0; // 总页数（最后一页）
  listOfPageItems: PageItem[] = [];

  constructor() {
  }

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {
    this.lastNum = Math.ceil(this.total / this.pageSize) || 1; // 向上取整
    this.listOfPageItems = this.getListOfPageItems(this.pageNum, this.lastNum);
  }

  private getListOfPageItems(pageNum: number, lastNum: number): PageItem[] {
    if (lastNum <= 9) {
      return concatWithPrevNext(generatePage(1, this.lastNum), pageNum, lastNum);
    } else {
      const firstPage = generatePage(1, 1);
      const lastPage = generatePage(lastNum, lastNum);
      const prevFivePage: PageItem = {type: 'prev5'};
      const nextFivePage: PageItem = {type: 'next5'};
      let listOfMidPage = [];
      if (pageNum < 4) {
        listOfMidPage = [...generatePage(2, 5), nextFivePage];
      } else if (pageNum > (lastNum - 4)) {
        listOfMidPage = [prevFivePage, ...generatePage(lastNum - 4, lastNum - 1)];
      } else {
        listOfMidPage = [prevFivePage, ...generatePage(pageNum - 2, pageNum + 2), nextFivePage];
      }
      return concatWithPrevNext([...firstPage, ...listOfMidPage, ...lastPage], pageNum, lastNum);
    }
  }

  changePage(item: PageItem) {
    if (!item.disable) {
      let newPageNum = this.pageNum;
      if (item.type === 'page') {
        newPageNum = item.num!;
      } else {
        const diff = {
          next: 1,
          prev: -1,
          next5: 5,
          prev5: -5
        };
        newPageNum += diff[item.type];
      }
      this.change.emit(clamp(newPageNum, 1, this.lastNum));
    }
  }

  onClickBtn(value: number) {
    console.log('value', value);
    if (value > 0) {
      this.changePage({
        type: 'page',
        num: value
      });
    } else {
      this.changePage({
        type: 'page',
        num: 1
      });
    }
  }
}

function generatePage(start: number, end: number): PageItem[] {
  const list: PageItem[] = [];
  for (let i = start; i <= end; i++) {
    list.push({
      type: 'page',
      num: i
    });
  }
  return list;
}

function concatWithPrevNext(page: PageItem[], pageNum: number, lastNum: number): PageItem[] {
  return [
    {
      type: 'prev',
      disable: pageNum === 1
    },
    ...page,
    {
      type: 'next',
      disable: pageNum === lastNum
    }
  ];
}
