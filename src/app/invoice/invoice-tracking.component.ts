import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastyService } from 'ng2-toasty';
import { TranslateService } from '@ngx-translate/core';
import { OrderService } from '../order/services/order.service';
import { UtilService } from './../shared/services';
import * as _ from 'lodash';

@Component({
  selector: 'invoice-tracking',
  templateUrl: './invoice.html',
  styleUrls: ['./invoice.css']
})
export class InvoiceTrackingComponent implements OnInit {
  public order: any = {};
  public listShops: any = [];
  public shopId: any = '';
  constructor(private route: ActivatedRoute, private toasty: ToastyService, private orderService: OrderService,
     private translate: TranslateService, private utilService: UtilService) {
  }

  ngOnInit() {
    this.utilService.setLoading(true);
    const trackingCode = this.route.snapshot.params.trackingCode;
    this.shopId = this.route.snapshot.queryParams.shopId;
    this.orderService.getTrackingByCode(trackingCode).then(resp => {
      this.order = resp.data;
      this.groupByShop(resp.data);
      this.utilService.setLoading(false);
    })
    .catch(err => {
      this.utilService.setLoading(false);
      this.toasty.error(this.translate.instant(err.data.message || 'Something went wrong, please try again'));
    });
   }

   groupByShop(invoice) {
    const groups = _.groupBy(invoice.details, 'shopId');
    const arrayGroup = Object.keys(groups).map(function(key) {
      return [groups[key]];
    });
    arrayGroup.map(g => {
      this.listShops.push(g[0]);
    });
   }
}
