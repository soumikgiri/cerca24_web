import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastyService } from 'ng2-toasty';

@Component({
  selector: 'delivery-history',
  templateUrl: './delivery-history.html'
})
export class DeliveryHistoryComponent implements OnInit {
  @Input() options: any = {
    productName: '',
    historyStatus: [],
    trackingCode: ''
  };

  constructor(
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit() { }
}
