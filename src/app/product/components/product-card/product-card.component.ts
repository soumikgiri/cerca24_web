import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'product-card',
  templateUrl: './product-card.html'
})
export class ProductCardComponent implements OnInit {
  @Input() product: any = {};
  @Input() showDeal: any = 0;
  @Input() isOwner: boolean = false;

  public price: number = 0;
  public salePrice: number = 0;

  constructor() { }

  ngOnInit() {
    if (this.product) {
      const vatSalePrice = this.product.taxPercentage ? this.product.salePrice * this.product.taxPercentage / 100 : 0;
      const vatBasePrice = this.product.taxPercentage ? this.product.price * this.product.taxPercentage / 100 : 0;
      this.price = this.product.price + vatBasePrice || 0;
      this.salePrice = this.product.salePrice + vatSalePrice || 0;
    }
  }
}
