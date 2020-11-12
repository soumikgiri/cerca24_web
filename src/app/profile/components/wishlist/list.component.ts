import { Component, OnInit, Input } from '@angular/core';
import { ToastyService } from 'ng2-toasty';
import { WishlistService } from '../../services';
import { UtilService } from './../../../shared/services/utils.service';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';

@Component({
  selector: 'wishlist-listing',
  templateUrl: './list.html'
})
export class WishListComponent implements OnInit {

  public items: any = [];
  public total: any = 0;
  public page: number = 1;
  public itemsPerPage: number = 12;
  public searchFields: any = {};
  public isLoading: any = false;

  constructor(private toasty: ToastyService, private wishlistService: WishlistService,
     private translate: TranslateService, private utilService: UtilService) { }

  ngOnInit() {
    this.query();
  }

  query() {
    this.utilService.setLoading(true);
    this.isLoading = true;
    let params = Object.assign({
      page: this.page,
      take: this.itemsPerPage
    }, this.searchFields);

    this.wishlistService.list(params).then((res) => {
      this.isLoading = false;
      this.utilService.setLoading(false);
      this.items = res.data.items;
      this.total = res.data.count;
    }).catch(err => {
      this.utilService.setLoading(false);
      this.isLoading = false;
      this.toasty.error(this.translate.instant('Something went wrong, please try again!'))
    });
  }

  remove(itemId: any, index: number) {
    if (window.confirm(this.translate.instant('Are you sure want to remove this item?'))) {
      this.wishlistService.remove(itemId)
        .then(() => {
          this.toasty.success(this.translate.instant('Item has been removed!'));
          this.items.splice(index, 1);
        })
        .catch((err) => this.toasty.error(this.translate.instant(err.data.data.message || 'Something went wrong, please try again!')));
    }
  }

}
