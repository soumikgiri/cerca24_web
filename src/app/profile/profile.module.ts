import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ProductModule } from '../product/product.module';
import { MediaModule } from '../media/media.module';
import { UtilsModule } from '../utils/utils.module';

import { ProfileRoutingModule } from './profile.routing';

import { ProfileSliderBarComponent } from './components/profile-sliderbar/sliderbar.component';
import { WishListComponent } from './components/wishlist/list.component';
import { UpdateComponent } from './components/update/update.component';
import { RefundListingComponent } from './components/refund/refund-listing.component';

import { WishlistService, RefundService } from './services';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbModule.forRoot(),
    ProfileRoutingModule,
    ProductModule,
    MediaModule,
    UtilsModule
  ],
  declarations: [
    WishListComponent,
    ProfileSliderBarComponent,
    UpdateComponent,
    RefundListingComponent
  ],
  providers: [
    WishlistService,
    RefundService
  ],
  exports: [
    WishListComponent,
    ProfileSliderBarComponent,
    UpdateComponent
  ]
})
export class ProfileModule { }
