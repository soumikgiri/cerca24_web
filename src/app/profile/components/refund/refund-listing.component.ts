import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastyService } from 'ng2-toasty';
import { TranslateService } from '@ngx-translate/core';
import { RefundService } from '../../services';

@Component({
  templateUrl: './listing.html'
})
export class RefundListingComponent implements OnInit {

  public items = [];
  public page: Number = 1;
  public take: Number = 10;
  public total: Number = 0;
  public searchFields: any = {
  };
  public sortOption = {
    sortBy: 'createdAt',
    sortType: 'desc'
  };

  constructor(private translate: TranslateService, private router: Router, private refundService: RefundService, private toasty: ToastyService) {
  }

  ngOnInit() {
    this.query();
  }

  query() {
    const params = Object.assign({
      page: this.page,
      take: this.take,
      sort: `${this.sortOption.sortBy}`,
      sortType: `${this.sortOption.sortType}`
    }, this.searchFields);

    this.refundService.list(params).then((res) => {
      this.items = res.data.items;
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
