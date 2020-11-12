import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SeoService, UtilService } from '../shared/services';
import { ShopService } from '../shop/services/shop.service';
import { SystemService } from '../shared/services';

declare var $: any;

@Component({
  templateUrl: './starter.component.html'
})
export class StarterComponent implements OnInit {
  public shops: any = [];
  public siteName: String = '';
  public sellerUrl: String = '';
  public appConfig: any = {};

  constructor(private router: Router, private route: ActivatedRoute, private seoService: SeoService,
    private shopService: ShopService, private systemService: SystemService, private utilService: UtilService) {
    this.utilService.setLoading(true);
    this.sellerUrl = window.appConfig.sellerUrl;
    this.systemService.configs().then(resp => {
      if (resp) {
        this.appConfig = resp;
        this.siteName = resp.siteName;
        this.seoService.update(resp.siteName, resp.homeSEO);
      }
    });
  }

  ngOnInit() {
    this.shopService.search({
      take: 4
    })
      .then(resp => {
        this.utilService.setLoading(false);
        this.shops = resp.data.items;
      }).catch(() => this.utilService.setLoading(false));
  }
}
