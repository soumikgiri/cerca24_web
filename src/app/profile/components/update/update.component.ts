import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { AuthService, LocationService } from '../../../shared/services';
import { ToastyService } from 'ng2-toasty';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';

@Component({
  selector: 'update-component',
  templateUrl: './update.html'
})
export class UpdateComponent implements OnInit, OnDestroy {
  public isSubmitted: boolean = false;
  private userLoadedSubscription: Subscription;
  public info: any = {};
  public avatarOptions: any = {};
  public avatarUrl: any = '';
  public cities: any = [];
  public citySelected: any = {
    city: '',
    areas: []
  };
  public mobile: any = {
    dial: '+260',
    number: ''
  };
  public dialCodes: any = [];

  constructor(private translate: TranslateService, private location: LocationService,
    private authService: AuthService, private toasty: ToastyService) {
    this.userLoadedSubscription = authService.userLoaded$.subscribe(data => this.info = data);
  }

  ngOnInit() {
    this.dialCodes = this.authService.getDialCodes();
    this.avatarOptions = {
      url: window.appConfig.apiBaseUrl + '/users/avatar',
      fileFieldName: 'avatar',
      onFinish: (resp) => {
        if (!resp.data) {
          return this.toasty.error(this.translate.instant('Something went wrong, please try again'));
        }
        this.avatarUrl = resp.data.url;
        this.info.avatarUrl = resp.data.url;
      }
    };
    this.cities = this.location.getCitiesZambia();

    if (this.authService.isLoggedin()) {
      this.authService.me().then((resp) => {
        this.info = resp.data;
        if (resp.data && resp.data.phoneNumber) {
          this.trackDial(resp.data.phoneNumber);
        }
        this.citySelected.city = resp.data.city;
        if (this.citySelected.city) {
          this.cityChange(this.citySelected.city);
        }
        this.avatarUrl = resp.data.avatarUrl;
      });
    }
  }

  ngOnDestroy() {
    this.userLoadedSubscription.unsubscribe();
  }

  submit(frm: any) {
    this.isSubmitted = true;
    if (!frm.valid) {
      return this.toasty.error(this.translate.instant('Something went wrong, please check and try again!'));
    }
    this.info.phoneNumber = `${this.mobile.dial}${this.mobile.number}`;
    this.authService.updateMe(this.info).then(resp => {
      this.toasty.success(this.translate.instant('Updated successfuly!'));
    }).catch((err) => this.toasty.error(this.translate.instant('Something went wrong, please check and try again!')));
  }

  cityChange(city: any) {
    this.citySelected = _.find(this.cities, { 'name': city });
    if (this.citySelected.areas && this.citySelected.areas.length) {
      this.info.area = this.citySelected.areas[0];
    } else {
      this.info.area = '';
    }
  }

  trackDial(string: any) {
    const validDials = this.dialCodes.filter(d => d.dialCode);
    validDials.forEach(d => {
      const i = string.indexOf(d.dialCode);
      if (i > -1) {
        const p = string.split(d.dialCode);
        this.mobile = {
          dial: d.dialCode,
          number: p[1]
        };
      }
    });
  }

  onlyNumberKey(event) {
    return (event.charCode === 8 || event.charCode === 0) ? null : event.charCode >= 48 && event.charCode <= 57;
  }

  selectDial(event) {
    this.mobile.dial = event;
  }

  swipe(url: string) {
    if (url) {
      let h = window.screen.availHeight;
      let w = window.screen.availWidth
      window.open(url, 'Image', 'width=' + w + ',height=' + h + ',resizable=1');
    } else {
      return this.toasty.error('Image is not available');
    }
  }
}
