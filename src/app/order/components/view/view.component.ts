import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { RefundModalComponent } from '../refundModal/refund-modal.component';
import { ToastyService } from 'ng2-toasty';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../shared/services';
import { OrderService } from '../../services/order.service';
import { MapModalComponent } from '../map-modal/map-modal.component';
import { DeliveryHistoryComponent } from '../delivery-history/delivery-history.component';
import * as _ from 'lodash';

@Component({
  selector: 'order-view',
  templateUrl: './view.html'
})
export class ViewComponent implements OnInit {

  public isShowed: boolean = false;
  public isSubmitted: any = false;
  public order: any = {};
  public details: any = [];
  public accessToken: any;
  public listShops: any = [];

  constructor(private route: ActivatedRoute, private toasty: ToastyService, private orderService: OrderService,
    private modalService: NgbModal, private translate: TranslateService, private authService: AuthService) {
    this.order = this.route.snapshot.data.order;
    this.order.deliveryPrice = 0;
    this.details = this.route.snapshot.data.order.details;
    this.groupByShop(this.details);
    this.accessToken = this.authService.getAccessToken();
  }

  ngOnInit() {
    // *! Calculate delivery price
    if (this.order.details.length) {
      this.order.details.forEach(i => {
        this.order.deliveryPrice += i.deliveryPrice;
      })
    }
    // *!
  }

  openRefund(item) {
    if (item.status === 'refunded') {
      return this.toasty.error(this.translate.instant('This order has been refunded.'));
    }
    const ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false
    };
    const modalRef = this.modalService.open(RefundModalComponent, ngbModalOptions);
    modalRef.componentInstance.orderDetailId = item._id;
  }

  exportPDF(item) {
    this.orderService.export(item._id, { access_token: this.accessToken }).then()
      .catch((err) => {
        const link = document.createElement('a');
        link.target = '_blank';
        link.download = 'file';
        link.href = err.url;
        link.click();
      });
  }

  groupByShop(invoice: any) {
    const groups = _.groupBy(invoice, 'shopId');
    const arrayGroup = Object.keys(groups).map(function (key) {
      return [groups[key]];
    });
    arrayGroup.map(g => {
      this.listShops.push(g[0]);
    });
  }
  openMap(item: any) {
    const ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      size: 'lg'
    };
    const modalRef = this.modalService.open(MapModalComponent, ngbModalOptions);
    modalRef.componentInstance.orderDetailId = item._id;
  }

  openHistoryStatus(item: any) {
    const ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false
    };
    const modalRef = this.modalService.open(DeliveryHistoryComponent, ngbModalOptions);
    modalRef.componentInstance.options = {
      historyStatus: item.deliveryHistory,
      trackingCode: item.trackingCode,
      productName: item.productDetails.name
    }
  }
}
