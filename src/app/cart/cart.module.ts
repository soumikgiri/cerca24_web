import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxStripeModule } from 'ngx-stripe';
import { UtilsModule } from '../utils/utils.module';

import {
  CheckoutComponent,
  CheckoutSuccessComponent,
  CodVerifyModalComponent,
  CheckoutCancelComponent,
  PickUpModalComponent,
  MTNPhoneConfirmModalComponent
} from './components';

import { CartResolver } from './resolvers/cart.resolver';
import { ConfigResolver } from '../shared/resolver';
import { NoPhotoPipe } from '../shared/pipes';

import { LocationService } from '../shared/services';
import { OrderService } from '../order/services/order.service';
import {
  TransactionService,
  CouponService,
  CompanyService
} from './services';

const routes: Routes = [{
  path: 'checkout',
  component: CheckoutComponent,
  resolve: {
    appConfig: ConfigResolver,
    cart: CartResolver
  }
}, {
  path: 'checkout/success',
  component: CheckoutSuccessComponent
},
{
  path: 'checkout/cancel',
  component: CheckoutCancelComponent
}];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    RouterModule.forChild(routes),
    UtilsModule,
    NgxStripeModule.forRoot()
  ],
  exports: [

  ],
  declarations: [
    CheckoutComponent, CheckoutSuccessComponent,
    CodVerifyModalComponent, CheckoutCancelComponent,
    NoPhotoPipe, PickUpModalComponent,
    MTNPhoneConfirmModalComponent
  ],
  entryComponents: [
    CodVerifyModalComponent,
    PickUpModalComponent,
    MTNPhoneConfirmModalComponent
  ],
  providers: [
    OrderService,
    LocationService,
    TransactionService,
    CartResolver,
    CouponService,
    CompanyService
  ]
})

export class CartModule { }
