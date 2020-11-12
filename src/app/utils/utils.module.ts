import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ReviewComponent, StarRating, PriceConvert, ReviewEditComponent, ReviewListComponent,
   NewsleterComponent, StatusDisplayComponent, PriceCurrencyComponent, DialCodeComponent, BreadcrumbComponent } from './components';
import { PriceCurrencyPipe } from './pipes/price-currency.pipe';
import { NoImagePipe } from './pipes/no-image.pipe';
import { SafeHtmlPipe } from './pipes/safeHtml.pipe';

import { NewsletterService } from './services/newsletter.service';
import { CurrencyService } from './services/currency.service';

import { LocationHrefDirective } from './directives/location-href/location-href.directive';

@NgModule({
  imports: [
    FormsModule,
    RouterModule,
    CommonModule,
    NgbModule.forRoot(),
    TranslateModule.forChild()
  ],
  declarations: [
    PriceConvert, StarRating, NewsleterComponent, ReviewEditComponent, BreadcrumbComponent,
    StatusDisplayComponent, PriceCurrencyComponent, PriceCurrencyPipe, NoImagePipe, SafeHtmlPipe,
    DialCodeComponent, ReviewComponent, ReviewListComponent, LocationHrefDirective
  ],
  exports: [
    TranslateModule,
    PriceConvert,
    StarRating,
    NewsleterComponent,
    StatusDisplayComponent,
    PriceCurrencyComponent,
    PriceCurrencyPipe,
    NoImagePipe, SafeHtmlPipe,
    DialCodeComponent,
    ReviewComponent,
    ReviewListComponent, LocationHrefDirective,
    ReviewEditComponent, BreadcrumbComponent
  ],
  providers: [
    NewsletterService,
    CurrencyService
  ],
  entryComponents: [ReviewEditComponent]
})
export class UtilsModule { }
