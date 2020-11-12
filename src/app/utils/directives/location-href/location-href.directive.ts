import { Directive, Input, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Directive({
  selector: 'a[appLocationHref]'
})
export class LocationHrefDirective {
  @Input() url: any = '';
  @Input() isNewTab: boolean = true;
  @HostListener('click', ['$event.target'])
  onClick() {
    if (this.url) {
      if (this.isNewTab) {
        this.router.navigate([this.url]);
      }
      sessionStorage.setItem('redirectUrl', this.url);
    }
  }
  constructor(private router: Router) {
  }
}
