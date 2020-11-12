import { ActivatedRoute } from '@angular/router';
import { Component } from '@angular/core';
import { CartService, AuthService } from '../../../shared/services';

@Component({
templateUrl: './checkout-success.html'
})
export class CheckoutSuccessComponent {
public isLoggedIn = this.auth.isLoggedin();
public invoiceId: any = '';
constructor( private service: CartService, private auth: AuthService, private route: ActivatedRoute) {
	this.service.clean();
	const id = route.snapshot.queryParams.trackingCode;
	this.invoiceId = id ? id : '';
}
}
