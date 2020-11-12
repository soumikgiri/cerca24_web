import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastyService } from 'ng2-toasty';
import { StaticPageService } from '../services/static-page.service';
import { TranslateService } from '@ngx-translate/core';
import { UtilService } from '../../shared/services';

@Component({
  selector: 'static-page',
  templateUrl: './view.html'
})
export class StaticPageComponent {
  public page: any = {};

  constructor(private translate: TranslateService, private router: Router, private route: ActivatedRoute,
     private toasty: ToastyService, private staticpageService: StaticPageService, private utilService: UtilService) {
    this.route.params.subscribe(data => {
      this.utilService.setLoading(true);
      this.staticpageService.find(data.alias).then((res) => {
        this.page = res.data;
        this.utilService.setLoading(false);
      })
        .catch(() => {
          this.utilService.setLoading(false);
          this.toasty.error(this.translate.instant('Something went wrong, please try again!'));
      });
    });

  }
}
