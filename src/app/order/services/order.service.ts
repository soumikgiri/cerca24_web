import { Injectable } from '@angular/core';
import { RestangularModule, Restangular } from 'ngx-restangular';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class OrderService {

  constructor(private restangular: Restangular) { }

  find(params: any): Promise<any> {
    return this.restangular.one('orders').get(params).toPromise();
  }

  findOne(id): Promise<any> {
    return this.restangular.one('orders', id).get().toPromise();
  }

  sendRefund(data: any): Promise<any> {
    return this.restangular.all('refundRequests').customPOST(data).toPromise();
  }

  checkPhone(phoneNumber: string): Promise<any> {
    return this.restangular.all('orders/phone/check').customPOST({ phoneNumber }).toPromise();
  }

  export(id, params: any): Promise<any> {
    return this.restangular.one('orders/details', id).one('/download/invoice').get(params).toPromise();
  }

  getTrackingByCode(trackingCode): Promise<any> {
    return this.restangular.one('orders/tracking', trackingCode).get().toPromise();
  }

  getDetailByCode(trackingCode): Promise<any> {
    return this.restangular.one('orders/detail/tracking', trackingCode).get().toPromise();
  }

  getPaymentStatus(trackingCode): Promise<any> {
    return this.restangular.one('orders/tracking', trackingCode).one('paymentStatus').get().toPromise();
  }

  location(orderDetailId: string): Promise<any> {
    return this.restangular.one('drivers/delivery/orders', orderDetailId).one('driver/location').get().toPromise();
  }
}
