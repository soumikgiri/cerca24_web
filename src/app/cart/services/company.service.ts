import { Injectable } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class CompanyService {

  constructor(private restangular: Restangular) { }

  search(): Promise<any> {
    return this.restangular.one('companies/delivery').get().toPromise();
  }

  getZoneByArea(companyId: string, params: any): Promise<any> {
    return this.restangular.one('companies', companyId).one('delivery/zones').get(params).toPromise();
  }
}
