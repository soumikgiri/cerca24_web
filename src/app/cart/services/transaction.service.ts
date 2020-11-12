import { Injectable } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class TransactionService {

  constructor(private restangular: Restangular) { }

  request(params: any): Promise<any> {
    return this.restangular.one('payment/transactions/request').customPOST(Object.assign(params, {
      redirectSuccessUrl: window.appConfig.paymentRedirectSuccessUrl,
      redirectCancelUrl: window.appConfig.paymentRedirectCancelUrl
    })).toPromise();
  }

  addInput(frm, name, value) {
    const elem = document.createElement('input');
    elem.type = 'hidden';
    elem.name = name;
    elem.value = value;
    frm.appendChild(elem);
  }

  doSubmitCybersource(params: any) {
    const form = document.createElement('form');
    document.body.appendChild(form);
    form.method = 'POST';
    form.action = params.url;
    for (let key in params.data) {
      this.addInput(form, key, params.data[key]);
    }
    form.submit();
  }
}