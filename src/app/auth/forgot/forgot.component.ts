import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, UtilService } from '../../shared/services';
import { ToastyService } from 'ng2-toasty';
import { TranslateService } from '@ngx-translate/core';

@Component({
  templateUrl: 'forgot.html'
})
export class ForgotComponent implements AfterViewInit{
  email: string = '';
  submitted: boolean = false;
  Auth: AuthService;

  constructor(private translate: TranslateService, auth: AuthService,
     public router: Router, private toasty: ToastyService, private utilService: UtilService) {
    this.Auth = auth;
    this.utilService.setLoading(true);
  }

  ngAfterViewInit() {
    this.utilService.setLoading(false);
  }

  forgot(frm: any) {
    this.submitted = true;
    this.Auth.forgot(this.email).then((resp) => {
      this.toasty.success(this.translate.instant('New password has been sent, please check your email inbox.'));
    })
      .catch((err) => this.toasty.error(this.translate.instant(err.data.data.message)));
  }
}
