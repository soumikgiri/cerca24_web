
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TransactionService } from '../../services/transaction.service';
import { OrderService } from '../../../order/services/order.service';
import { Router } from '@angular/router';
@Component({
  templateUrl: './mtn-modal.html'
})
export class MTNPhoneConfirmModalComponent implements OnInit {
  @Input() data: any;
  public phoneNumber = '';
  private timeoutCheck: any = null;
  public waiting: boolean = false;

  constructor(public activeModal: NgbActiveModal, private transactionService: TransactionService,
    private orderService: OrderService, private router: Router) {
  }

  ngOnInit() {
  }

  public onlyNumberKey(event) {
    return (event.charCode === 8 || event.charCode === 0) ? null : event.charCode >= 48 && event.charCode <= 57;
  }

  submit(frm: any) {
    if (!this.phoneNumber || !this.phoneNumber.trim()) {
      return;
    }

    this.transactionService.request({
      gateway: 'mtn',
      service: 'order',
      itemId: this.data._id,
      phoneNumber: this.phoneNumber
    })
      .then(() => {
        this.waiting = true;
        this.checkOrderStatus();
      })
      .catch((err) => alert('Something went wrong, please try again!'));
  }

  checkOrderStatus() {
    this.orderService.getPaymentStatus(this.data.trackingCode)
      .then(resp => {
        if (['paid', 'completed'].indexOf(resp.data.status) > -1) {
          this.activeModal.close();
          this.router.navigate(['/checkout/success'], {
            queryParams: {
              trackingCode: this.data.trackingCode
            }
          });
          clearTimeout(this.timeoutCheck);
        } else if (resp.data.status === 'cancelled') {
          this.activeModal.close();
          this.router.navigate(['/checkout/cancel'], {
            queryParams: {
              trackingCode: this.data.trackingCode
            }
          });
          clearTimeout(this.timeoutCheck);
        } else {
          this.timeoutCheck = setTimeout(this.checkOrderStatus.bind(this), 15000);
        }
      });
  }

  close() {
    if (this.timeoutCheck) {
      clearTimeout(this.timeoutCheck);
    }

    this.activeModal.close();
  }
}