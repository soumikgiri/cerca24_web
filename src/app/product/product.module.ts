import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ProductRoutingModule } from './product.routing';
import { CartModule } from '../cart/cart.module';
import { ShareModule } from '@ngx-share/core';

import { NgxImageZoomModule } from 'ngx-image-zoom';
import { SlickCarouselModule } from 'ngx-slick-carousel';

import {
  ProductDetailComponent,
  ProductCardComponent,
  FeaturedProductsComponent,
  SearchComponent,
  SearchSidebarComponent
} from './components';

import {
  CategoryService,
  ProductService,
  ProductVariantService
} from './services';

import {
  ReviewService,
  GoogleAnalyticsService
} from '../shared/services';

import { WishlistService } from '../profile/services';

import { ProductResolver } from './resolvers/product.resolver';
import { SearchResolver } from './resolvers/search.resolver';

import { UtilsModule } from '../utils/utils.module';
import { MessageModule } from '../message/message.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ProductRoutingModule,
    NgbModule.forRoot(),
    NgxImageZoomModule.forRoot(),
    ShareModule.forRoot(),
    CartModule,
    UtilsModule,
    SlickCarouselModule,
    MessageModule
  ],
  declarations: [
    ProductDetailComponent,
    FeaturedProductsComponent,
    ProductCardComponent,
    SearchSidebarComponent,
    SearchComponent
  ],
  providers: [
    CategoryService,
    ProductService,
    ProductResolver,
    SearchResolver,
    ProductVariantService,
    ReviewService,
    WishlistService,
    GoogleAnalyticsService
  ],
  exports: [
    FeaturedProductsComponent,
    ProductCardComponent,
    SearchSidebarComponent,
    SearchComponent
  ]
})
export class ProductModule { }
