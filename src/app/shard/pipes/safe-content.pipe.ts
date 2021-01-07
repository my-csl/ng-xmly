import { Pipe, PipeTransform } from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';

type contentType = 'html' | 'style' | 'script' | 'url' | 'resourceUrl'

const funMap = {
  html: 'bypassSecurityTrustHtml',
  style: 'bypassSecurityTrustStyle',
  script: 'bypassSecurityTrustScript',
  url: 'bypassSecurityTrustUrl',
  resourceUrl: 'bypassSecurityTrustResourceUrl',
}

@Pipe({
  name: 'safeContent'
})
export class SafeContentPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) {
  }

  /*
  * 如果在angular中直接操作dom，angular会自动帮我们做无害化处理，会把script等会被注入漏洞的标签直接不显示
  * 但是angular还是会报一个警告提示用户
  * 我们可以通过DomSanitizer去信任一个变量，让angular不在提示警告
  * */

  transform(value: string, type: contentType = 'html'): unknown {
    // @ts-ignore
    return this.sanitizer[funMap[type]](value);
  }

}
