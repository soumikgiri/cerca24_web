import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../services';
import { Subscription } from 'rxjs/Subscription';
import { CategoryService } from '../../product/services';

@Component({
  selector: 'search-bar',
  templateUrl: './search-bar.html'
})
export class SearchbarComponent implements OnInit {
  public q: any = '';
  private cartLoadedSubscription: Subscription;
  public cart: any = [];
  public cates: any = [];

  constructor(public router: Router, private cartService: CartService, private cateService: CategoryService) {
    this.cartLoadedSubscription = cartService.cartChanged$.subscribe(data => this.cart = data);
  }

  ngOnInit() {
    this.cart = this.cartService.get();
    // this.cateService.tree().then(res => this.cates = res);
  }
}
