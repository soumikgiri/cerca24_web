import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastyService } from 'ng2-toasty';
import { SeoService, AuthService, UtilService } from '../../../shared/services';
import { ProductService } from '../../../product/services';
import { ShopService } from './../../services/shop.service';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ReportComponent } from '../report/report.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  templateUrl: './detail.html'
})
export class ShopDetailComponent implements OnInit {
  public shop: any;
  public products = [];
  public page: any = 1;
  public take: any = 12;
  public totalProducts: any = 0;
  public isLoading: Boolean = false;
  public searchFields: any = {
    q: '',
    categoryId: ''
  };
  public tab = 'products';
  public socialLink: any = false;
  public socialConnect: any = false;
  public userID: any;
  public tree: any = [];

  constructor(private translate: TranslateService, private authService: AuthService,
    private route: ActivatedRoute, private seoService: SeoService, private modalService: NgbModal,
    private productService: ProductService, private toasty: ToastyService, private ultiService: UtilService,
    private shopService: ShopService) {
    if (this.authService.isLoggedin()) {
      this.authService.getCurrentUser().then(res => this.userID = res._id);
    }
    this.shop = this.route.snapshot.data.shop;

    if (this.shop.socials.facebook || this.shop.socials.google ||
      this.shop.socials.twitter ||
      this.shop.socials.youtube || this.shop.socials.instagram ||
      this.shop.socials.flickr) {
      this.socialLink = true;
    }

    if (this.shop.socialConnected.facebook || this.shop.socialConnected.twitter
      || this.shop.socialConnected.google || this.shop.socialConnected.instagram) {
      this.socialConnect = true;
    }
    this.shopService.shopTree(this.shop._id).then(resp => this.tree = resp.data);
  }

  ngOnInit() {
    this.updateSeo();
    this.query();
  }

  updateSeo() {
    let image = '';
    if (this.shop.logo) {
      image = this.shop.logo.mediumUrl;
    }

    this.seoService.update(this.shop.name, { description: this.shop.headerText || '', image });

    if (this.shop.gaCode) {
      this.seoService.trackPageViewForShop(this.shop._id, this.shop.gaCode);
    }
  }

  query() {
    this.ultiService.setLoading(true);
    this.isLoading = true;
    const params = Object.assign({
      shopId: this.shop.id,
      page: this.page,
      take: this.take
    }, this.searchFields);

    this.productService.search(params).then((res) => {
      this.ultiService.setLoading(false);
      this.isLoading = false;
      this.products = res.data.items;
      this.totalProducts = res.data.count;
    })
      .catch(() => {
        this.toasty.error(this.translate.instant('Something went wrong, please try again!'));
        this.isLoading = false;
      });
  }

  updateQuery(cateId: string) {
    this.tab = 'products';
    this.ultiService.setLoading(true);
    this.searchFields.categoryId = cateId;
    const params = Object.assign({
      shopId: this.shop.id,
      page: this.page,
      take: this.take
    }, this.searchFields);

    this.productService.search(params).then((res) => {
      this.ultiService.setLoading(false);
      this.products = res.data.items;
      this.totalProducts = res.data.count;
    })
      .catch(() => this.toasty.error(this.translate.instant('Something went wrong, please try again!')));
  }

  keyPress(event: any) {
    if (event.charCode === 13) {
      this.query();
      this.tab = 'products';
    }
  }

  report() {
    if (!this.authService.isLoggedin()) {
      return this.toasty.error(this.translate.instant('You have to log in first.'));
    }
    const ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false
    };
    const modalRef = this.modalService.open(ReportComponent, ngbModalOptions);
    modalRef.componentInstance.shopId = this.shop.id;
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
