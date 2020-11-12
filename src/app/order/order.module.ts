import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { OrderRoutingModule } from './order.routing';

import { ViewComponent } from './components/view/view.component';
import { ListingComponent } from './components/listing/listing.component';
import { RefundModalComponent } from './components/refundModal/refund-modal.component';
import { MapModalComponent } from './components/map-modal/map-modal.component';
import { DeliveryHistoryComponent } from './components/delivery-history/delivery-history.component';

import { OrderService } from './services/order.service';
import { ListingResolver } from './resolvers/listing.resolver';
import { ViewResolver } from './resolvers/view.resolver';

import { UtilsModule } from '../utils/utils.module';
import { AgmCoreModule } from '@agm/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    OrderRoutingModule,
    NgbModule.forRoot(),
    UtilsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDGBeXG1vkFY6ue4_HsHXDk-kzzoUNS-VY'
    })
  ],
  declarations: [
    ViewComponent,
    ListingComponent,
    RefundModalComponent,
    MapModalComponent,
    DeliveryHistoryComponent
  ],
  providers: [
    OrderService,
    ListingResolver,
    ViewResolver
  ],
  exports: [
    ListingComponent
  ],
  entryComponents: [
    RefundModalComponent,
    MapModalComponent,
    DeliveryHistoryComponent
  ]
})
export class OrderModule { }
