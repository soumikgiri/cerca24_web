import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InvoiceTrackingComponent } from './invoice-tracking.component';
import { InvoiceDetailComponent } from './invoice-tracking-detail';

import { OrderService } from '../order/services/order.service';

import { UtilsModule } from '../utils/utils.module';

const routes: Routes = [
  {
    path: 'tracking/:trackingCode',
    component: InvoiceTrackingComponent
  },
  {
    path: 'detail/:trackingCode',
    component: InvoiceDetailComponent
  }
];


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbModule.forRoot(),
    RouterModule.forChild(routes),
    UtilsModule
  ],
  declarations: [
    InvoiceTrackingComponent,
    InvoiceDetailComponent
  ],
  providers: [
    OrderService
  ],
  exports: [
  ],
  entryComponents: [ ]
})
export class InvoiceModule { }
