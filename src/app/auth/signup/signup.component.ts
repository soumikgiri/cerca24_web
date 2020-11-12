import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, UtilService } from '../../shared/services';
import { ToastyService } from 'ng2-toasty';
import { TranslateService } from '@ngx-translate/core';

@Component({
  templateUrl: 'signup.component.html'
})
export class SignupComponent implements AfterViewInit {
  Auth: AuthService;
  public account: any = {
    email: '',
    password: '',
    phoneNumber: '',
    name: ''
  };
  public name: any = {
    firstName: '',
    lastName: ''
  };
  public input: any = {
    rePassword: ''
  };
  public submitted: any = false;
  public phone: any = {
    dial: '+260',
    number: ''
  };

  constructor(auth: AuthService, public router: Router, private toasty: ToastyService,
     private translate: TranslateService, private utilService: UtilService) {
    this.Auth = auth;
    this.utilService.setLoading(true);
  }

  ngAfterViewInit() {
    this.utilService.setLoading(false);
  }

  public onlyNumberKey(event) {
    return (event.charCode === 8 || event.charCode === 0) ? null : event.charCode >= 48 && event.charCode <= 57;
  }

  selectDial(event) {
    this.phone.dial = event;
  }

  public submit(frm: any) {
    this.submitted = true;

    if (frm.invalid) {
      return;
    }

    if (this.account.password !== this.input.rePassword) {
      return this.toasty.error(this.translate.instant('Confirm password doest not match'));
    }

    this.account.name = this.name.firstName + ' ' + this.name.lastName;
    this.Auth.register(this.account)
      .then(resp => {
        this.toasty.success(this.translate.instant('Please check your email inbox to verify your account. Check your spam folder too'));
        this.router.navigate(['/auth/login']);
      })
      .catch(err => {
        this.toasty.error(this.translate.instant(err.data.data.message || 'Something went wrong, please try again'));
      });
  }

  inputPhone(number) {
    this.account.phoneNumber = this.phone.dial + number;
  }
}
