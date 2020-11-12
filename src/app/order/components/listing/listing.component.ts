import { UtilService } from './../../../shared/services/utils.service';
import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { ToastyService } from 'ng2-toasty';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';

@Component({
  selector: 'order-listing',
  templateUrl: './listing.html'
})
export class ListingComponent implements OnInit {

  public orders = [];
  public page: Number = 1;
  public take: Number = 10;
  public total: Number = 0;
  public searchFields: any = {
    status: ''
  };
  public sortOption = {
    sortBy: 'createdAt',
    sortType: 'desc'
  };

  constructor(private translate: TranslateService, private utilService: UtilService,
     private orderService: OrderService, private toasty: ToastyService) {
  }

  ngOnInit() {
    this.query();
  }

  query() {
    this.utilService.setLoading(true);
    const params = Object.assign({
      page: this.page,
      take: this.take,
      sort: `${this.sortOption.sortBy}`,
      sortType: `${this.sortOption.sortType}`
    }, this.searchFields);

    this.orderService.find(params).then((res) => {
      this.utilService.setLoading(false);
      this.orders = res.data.items;
      this.total = res.data.count;
    })
      .catch(() => this.toasty.error(this.translate.instant('Something went wrong, please try again!')));
  }

  sortBy(field: string, type: string) {
    this.sortOption.sortBy = field;
    this.sortOption.sortType = type;
    this.query();
  }
}
