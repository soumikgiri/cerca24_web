import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services';
import { TranslateService } from '@ngx-translate/core';
import { ToastyService } from 'ng2-toasty';
import { UtilService } from './../../shared/services';

@Component({
  templateUrl: 'login.component.html'
})
export class LoginComponent implements AfterViewInit {
  private Auth: AuthService;
  public credentials = {
    email: '',
    password: ''
  };
  public submitted: any = false;

  constructor(auth: AuthService, public router: Router, private translate: TranslateService,
     private toasty: ToastyService, public utilService: UtilService) {
    this.Auth = auth;
    this.utilService.setLoading(true);
  }

  ngAfterViewInit() {
    this.utilService.setLoading(false);
  }

  login(frm: any) {
    this.submitted = true;
    if (frm.invalid) {
      return;
    }

    this.Auth.login(this.credentials).then(() => {
      const redirectUrl = sessionStorage.getItem('redirectUrl');
      if (redirectUrl) {
        sessionStorage.removeItem('redirectUrl');
        this.router.navigate([redirectUrl]);
      } else {
        this.router.navigate(['/']);
      }
    })
      .catch(() => {
        this.toasty.error(this.translate.instant('Your account is not activated or register. Please recheck again or contact to our admin to resolve it.'));
      });
  }
}
