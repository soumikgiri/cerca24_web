import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastyService } from 'ng2-toasty';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from './../../../shared/services/auth.service';

@Component({
  templateUrl: './pickup-modal.html'
})
export class PickUpModalComponent implements OnInit {
  @Input() userPickUpInfo: any;
  public pickUpPerInfo: any = {
    pickUpBy: 'self',
    name: null,
    phoneNumber: null,
    idNumber: null
  };
  public pickUpBy: any = 'self';
  public mobile: any = {
    dial: '+260',
    number: ''
  };
  public dialCodes: any = [];

  constructor(private translate: TranslateService, private auth: AuthService,
    private toasty: ToastyService, public activeModal: NgbActiveModal) {
  }

  ngOnInit() {
    this.dialCodes = this.auth.getDialCodes();
    if (this.userPickUpInfo) {
      this.pickUpPerInfo = Object.assign(this.pickUpPerInfo, this.userPickUpInfo);
      if (this.pickUpPerInfo.phoneNumber) {
        this.trackDial(this.pickUpPerInfo.phoneNumber);
      }
    }
  }

  submit(frm: any) {
    if (!frm.valid) {
      return this.toasty.error(this.translate.instant('Please fill out all fields'));
    }
    if (this.mobile.dial && this.mobile.number) {
      this.pickUpPerInfo.phoneNumber = this.mobile.dial + this.mobile.number;
    }
    this.activeModal.close({
      userPickUpInfo: this.pickUpPerInfo
    });
  }

  selectDial(event) {
    this.mobile.dial = event;
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
}
