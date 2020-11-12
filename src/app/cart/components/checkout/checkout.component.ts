
import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { StripeService, ElementsOptions, StripeCardComponent } from 'ngx-stripe';
import { TranslateService } from '@ngx-translate/core';
import { ToastyService } from 'ng2-toasty';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { CodVerifyModalComponent } from '../cod-verify-modal/cod-verify-modal.component';
import { MTNPhoneConfirmModalComponent } from './mtn-modal.component';
import { PickUpModalComponent } from './../pickup-modal/pickup-modal.component';

import {
  TransactionService,
  CouponService,
  CompanyService
} from '../../services';
import {
  AuthService,
  CartService,
  LocationService
} from '../../../shared/services';
import { OrderService } from '../../../order/services/order.service';

import * as _ from 'lodash';

@Component({
  templateUrl: './checkout.html'
})
export class CheckoutComponent implements OnInit {
  public cart: any = [];
  public totalPrice: any = 0;
  public totalTaxPrice: any = 0;
  public totalShippingPrice: any = 0;
  public totalDiscountPrice: any = 0;
  public userInfo: any = {
    country: 'Zambia'
  };
  public mobile: any = {
    dial: '+260',
    number: ''
  };
  public isSubmitted: any = false;
  public codCode: any = '';
  public orderId: any;
  public coupon: any = '';
  public productsNonCod: any = [];

  @ViewChild(StripeCardComponent) card: StripeCardComponent;
  public cardHolderName: any = '';
  public cardOptions: any = {};
  // optional parameters
  public elementsOptions: ElementsOptions = {
    locale: 'en'
  };

  public stripeTest: FormGroup;
  public stripeToken: any = null;
  public paymentGateway: any;
  public cities: any = [];
  public citySelected: any = {
    areas: []
  };
  public dialCodes: any = [];
  public companies: Array<any>;

  constructor(
    private translate: TranslateService,
    private route: ActivatedRoute,
    private cartService: CartService,
    private orderService: OrderService,
    private transactionService: TransactionService,
    private locationService: LocationService,
    private toasty: ToastyService,
    private modalService: NgbModal,
    private couponService: CouponService,
    private fb: FormBuilder,
    private stripeService: StripeService,
    private companyService: CompanyService,
    private authService: AuthService
  ) {
    const config = this.route.snapshot.data['appConfig'];

    if (this.authService.isLoggedin()) {
      this.authService.me().then((resp) => {
        this.userInfo.lastName = resp.data.name.slice(resp.data.name.lastIndexOf(' ') + 1, resp.data.name.length);
        this.userInfo.firstName = resp.data.name.slice(0, resp.data.name.lastIndexOf(this.userInfo.lastName) - 1);
        this.userInfo.email = resp.data.email;
        this.userInfo.streetAddress = resp.data.address;
        this.userInfo.city = resp.data.city;
        if (resp.data.city) {
          this.cityChange(resp.data.city);
        }
        this.userInfo.area = resp.data.area;
        this.userInfo.phoneNumber = resp.data.phoneNumber;
        if (resp.data.phoneNumber) {
          this.trackDial(resp.data.phoneNumber);
        }
      });
    }

    this.paymentGateway = config.paymentGatewayConfig;
    this.userInfo.userCurrency = config ? config.customerCurrency : 'ZMW';
  }

  ngOnInit() {
    this.cart = this.route.snapshot.data.cart;
    if (this.cart && this.cart.products.length) {
      this.updateTotalPrice();
      this.companyService.search().then(resp => this.companies = resp.data.items);
      this.cart.products.forEach(product => {
        product.isPickUpAtStore = true;
        product.userPickUpInfo = {
          pickUpBy: 'self'
        };
        // if (product.product.shop.pickUpAddress.length) {
        //   product.pickUpAddress = product.product.shop.pickUpAddress[0];
        // }
      });
    }
    this.cities = this.locationService.getCitiesZambia();
    this.dialCodes = this.authService.getDialCodes();
    // this.stripeService.setKey(window.appConfig.stripeKey);
    // this.stripeTest = this.fb.group({
    //   cardName: ['', [Validators.required]]
    // });
  }

  remove(index: number) {
    this.cartService.remove(this.cart.products[index]);
    this.cart.products.splice(index, 1);
    this.updateTotalPrice();
  }

  updateTotalPrice() {
    this.totalPrice = 0;
    this.totalTaxPrice = 0;
    this.totalShippingPrice = 0;
    this.totalDiscountPrice = 0;
    this.productsNonCod = [];
    if (!this.cart.products.length) {
      return;
    }
    this.cart.products.forEach((product) => {
      if (product.quantity < 1) {
        product.quantity = 1;
      }
      product.calculatedData = {
        product: product.userProductPrice * product.quantity,
        taxClass: product.taxClass,
        tax: 0,
        // shipping: 0,
        discount: 0,
        deliveryPrice: 0
      };
      // if (product.deliveryPrice) {
      //   product.calculatedData.shipping = product.deliveryPrice;
      // }
      if (product.deliveryZonePrice) {
        product.calculatedData.deliveryPrice = product.deliveryZonePrice;
      } else {
        product.deliveryZonePrice = 0;
        product.calculatedData.deliveryPrice = 0;
      }
      if (this.userInfo.paymentMethod === 'cod' && !product.product.shop.doCOD) {
        this.productsNonCod.push(product);
      }
      if (product.taxPercentage && product.taxClass) {
        product.calculatedData.taxClass = product.taxClass;
        product.calculatedData.tax = product.calculatedData.product * (product.taxPercentage / 100);
        this.totalTaxPrice += product.calculatedData.tax;
      }
      if (product && product.isDiscounted && product.discountPercentage) {
        product.calculatedData.discount = product.calculatedData.product * (product.discountPercentage / 100);
        this.totalDiscountPrice += product.calculatedData.discount;
      }

      // if (!product.freeShip && !product.storeWideShipping) {
      //   let shipping = product.shippingSettings.defaultPrice;
      //   if (product.quantity > 1) {
      //     shipping += product.shippingSettings.perQuantityPrice * (product.quantity - 1);
      //   }
      //   product.calculatedData.shipping = shipping;
      //   this.totalShippingPrice += product.calculatedData.shipping;
      // }

      // product.calculatedData.total = product.calculatedData.product + product.calculatedData.tax + product.calculatedData.shipping - product.calculatedData.discount;
      product.calculatedData.total = product.calculatedData.product + product.calculatedData.tax + product.calculatedData.deliveryPrice - product.calculatedData.discount;
      // this.totalShippingPrice += product.calculatedData.shipping;
      this.totalShippingPrice += product.calculatedData.deliveryPrice;
      this.totalPrice += product.calculatedData.total;
    });
  }

  updatePickUpAddress(val: string, i: number) {
    this.cart.products[i].pickUpAddress = val;
    this.cart.product[i].deliveryCompanyId = '';
  }

  submit(frm: any) {
    this.isSubmitted = true;
    if (frm.invalid) {
      return this.toasty.error(this.translate.instant('Please submit valid form'));
    }
    if (!this.userInfo.paymentMethod) {
      return this.toasty.error(this.translate.instant('Please select payment method!'));
    }
    let error = false;
    if (!this.cart.products || !this.cart.products.length) {
      return this.toasty.error(this.translate.instant('Please add product to your cart!'));
    }
    this.cart.products.forEach((cart) => {
      if (cart.error) {
        error = true;
        return this.toasty.error(`${cart.product.name}` + this.translate.instant(' is out of stock'));
      }
      if (cart.product.shop.pickUpAddress && cart.product.shop.pickUpAddress.length && !cart.pickUpAddress && cart.isPickUpAtStore) {
        error = true;
        return this.toasty.error(this.translate.instant('You have to select a pick up address for ') + `${cart.product.name}`);
      }
      if (cart.quantity > cart.stockQuantity) {
        error = true;
        return this.toasty.error(`${cart.product.name}` + this.translate.instant(' just has ') +
          `${cart.stockQuantity}` + this.translate.instant(' in the stock'));
      }
      if (!cart.deliveryCompanyId && !cart.isPickUpAtStore) {
        error = true;
        return this.toasty.error(this.translate.instant('You have to select a company delivery for ') + `${cart.product.name}`);
      }
      if (cart.product.shop.pickUpAddress && cart.product.shop.pickUpAddress.length && !cart.pickUpAddressObj && !cart.isPickUpAtStore) {
        error = true;
        return this.toasty.error(this.translate.instant('You have to select a pickup address of shop for ') + `${cart.product.name}`);
      }

      if (this.userInfo.paymentMethod === 'cod') {
        if (this.productsNonCod.length) {
          error = true;
          return this.toasty.error(this.translate.instant('You cannot checkout at once for COD. You need checkout separately because some Seller does not COD'));
        }
        const areas = cart.product.restrictCODAreas;
        const index = _.findIndex(areas, (a) => a.toString().trim().toLowerCase() === this.userInfo.zipCode.trim().toLowerCase());
        if (index > -1) {
          error = true;
          return this.toasty.error(`${this.userInfo.zipCode}` + this.translate.instant(' is not been supported for shipping.'));
        }
      }
    });

    if (error) {
      return;
    }


    if (this.userInfo.paymentMethod === 'cod') {
      const phoneNumber = `${this.mobile.dial}${this.mobile.number}`;
      this.orderService.checkPhone(phoneNumber)
        .then(resp => {
          const modalRef = this.modalService.open(CodVerifyModalComponent, {
            backdrop: 'static',
            keyboard: false
          });
          modalRef.componentInstance.phoneNumber = phoneNumber;
          modalRef.result.then(result => {
            this.userInfo.phoneVerifyCode = result.verifyCode;
            if (!this.userInfo.phoneVerifyCode) {
              return this.toasty.error(this.translate.instant('Look like you dont get any verify code, please click the link above to retry again.'));
            }
            this.doPost();
          }, () => { });
        })
        .catch((err) => this.toasty.error(this.translate.instant('An error occurred, please recheck your phone number!')));
    } else if (this.userInfo.paymentMethod === 'stripe') {
      const name = this.stripeTest.get('cardName').value;
      if (!name) {
        return this.toasty.error(this.translate.instant('Please enter card holder name!'));
      }
      this.stripeService
        .createToken(this.card.getCard(), { name })
        .subscribe(result => {
          if (result.token) {
            // Use the token to create a charge or a customer
            // https://stripe.com/docs/charges
            this.stripeToken = result.token.id;
            this.doPost();
          } else if (result.error) {
            // Error creating the token
            this.toasty.error(this.translate.instant('Something went wrong, please try again!'));
          }
        });
    } else {
      // TODO - implement me
      this.doPost();
    }
  }

  reSendVerifyNumber() {
    const phoneNumber = `${this.mobile.dial}${this.mobile.number}`;
    if (!phoneNumber || phoneNumber === 'undefined' || typeof (phoneNumber) === 'undefined') {
      return this.toasty.error(this.translate.instant('Invalid phone number, please recheck again.'));
    }
    this.orderService.checkPhone(phoneNumber)
      .then(resp => {
        const modalRef = this.modalService.open(CodVerifyModalComponent, {
          backdrop: 'static',
          keyboard: false
        });
        modalRef.componentInstance.phoneNumber = phoneNumber;
        modalRef.result.then(result => {
          this.userInfo.phoneVerifyCode = result.verifyCode;
          if (!this.userInfo.phoneVerifyCode) {
            return this.toasty.error(this.translate.instant('Look like you dont get any verify code, please click the link above to retry again.'));
          }
          this.doPost();
        }, () => { });
      })
      .catch((err) => this.toasty.error(this.translate.instant('An error occurred, please recheck your phone number!')));
  }

  doPost() {
    const products = this.cart.products.map(item => _.pick(item, ['productId', 'productVariantId', 'quantity',
      'userNote', 'couponCode', 'userPickUpInfo', 'pickUpAddress', 'deliveryCompanyId', 'deliveryZoneId', 'pickUpAddressObj']));
    this.userInfo.phoneNumber = `${this.mobile.dial}${this.mobile.number}`;
    this.cartService.checkout({
      products,
      firstName: this.userInfo.firstName,
      lastName: this.userInfo.lastName,
      email: this.userInfo.email,
      phoneNumber: this.userInfo.phoneNumber,
      streetAddress: this.userInfo.streetAddress,
      city: this.userInfo.city,
      state: this.userInfo.area,
      country: this.userInfo.country,
      shippingAddress: this.userInfo.shippingAddress,
      userCurrency: this.userInfo.userCurrency,
      phoneVerifyCode: this.userInfo.phoneVerifyCode,
      paymentMethod: this.userInfo.paymentMethod,
      zipCode: this.userInfo.zipCode
    })
      .then((resp) => {
        if (this.userInfo.paymentMethod === 'cod') {
          this.cartService.clean();
          window.location.href = '/cart/checkout/success';
        } else if (this.userInfo.paymentMethod === 'paypal') {
          this.transactionService.request({
            gateway: 'paypal',
            service: 'order',
            itemId: resp.data._id
          })
            .then(transactionResp => {
              window.location.href = transactionResp.data.redirectUrl;
            })
            .catch((err) => this.toasty.error(err.data.message || err.data.data.message || this.translate.instant('Something went wrong, please try again!')));
        } else if (this.userInfo.paymentMethod === 'stripe') {
          this.transactionService.request({
            gateway: 'stripe',
            service: 'order',
            itemId: resp.data._id,
            stripeToken: this.stripeToken
          })
            .then(res => {
              window.location.href = '/cart/checkout/success';
            })
            .catch((err) => this.toasty.error(err.data.message || err.data.data.message || this.translate.instant('Something went wrong, please try again!')));
        } else if (this.userInfo.paymentMethod === 'cybersource') {
          this.transactionService.request({
            gateway: 'cybersource',
            service: 'order',
            itemId: resp.data._id
          })
            .then(transactionResp => {
              this.transactionService.doSubmitCybersource(transactionResp.data);
            })
            .catch((err) => this.toasty.error(err.data.message || err.data.data.message || this.translate.instant('Something went wrong, please try again!')));
        } else if (this.userInfo.paymentMethod === 'mtn') {
          // open box confirm phone number and do transaction
          const modalRef = this.modalService.open(MTNPhoneConfirmModalComponent, {
            backdrop: 'static',
            keyboard: false
          });
          modalRef.componentInstance.data = resp.data;
        } else {
          window.location.href = '/cart/checkout/success';
        }
      })
      .catch(err => this.toasty.error(err.data.message || err.data.data.message || this.translate.instant('Something went wrong, please try again!')));
  }

  onlyNumberKey(event) {
    return (event.charCode === 8 || event.charCode === 0) ? null : event.charCode >= 48 && event.charCode <= 57;
  }

  selectDial(event) {
    this.mobile.dial = event;
  }

  checkCoupon() {
    if (!this.coupon) {
      return this.toasty.error(this.translate.instant('Please enter coupon code!'));
    }
    let i = 0;
    this.cart.products.forEach(prod => {
      i++;
      this.couponService.check({ code: this.coupon, shopId: prod.shopId }).then(resp => {
        prod.isDiscounted = true;
        prod.discountPercentage = resp.data.discountPercentage;
        prod.couponCode = this.coupon;
        if (i === this.cart.products.length) {
          this.updateTotalPrice();
        }
      })
        .catch(() => {
          this.toasty.error(`Can not apply this coupon for product ${prod.product.name}!`);
        });
    });
  }

  openPickUp(userPickUpInfo, index) {
    // if (!isPickUpAtStore) {
    //   return this.cart.products[index].userPickUpInfo = {};
    // }
    const modalRef = this.modalService.open(PickUpModalComponent, {
      backdrop: 'static',
      keyboard: false
    });
    modalRef.componentInstance.userPickUpInfo = userPickUpInfo;
    modalRef.result.then(result => {
      this.cart.products[index].userPickUpInfo = result.userPickUpInfo ? result.userPickUpInfo : { pickUpBy: 'self' };
    }, () => { });
  }

  chooseSelf(index) {
    this.cart.products[index].userPickUpInfo = { pickUpBy: 'self' };
  }

  cityChange(city: any) {
    this.citySelected = _.find(this.cities, { 'name': city });
    this.userInfo.area = this.citySelected.areas && this.citySelected.areas.length ? this.citySelected.areas[0] : '';

    // Get zones by city if have deliveryCompanyId
    this.getZoneOfCity(true); // change city, compare all again
    setTimeout(() => {
      this.updateTotalPrice();
    }, 1000);
  }

  areaChange(area: any) {
    if (area) {
      this.getZoneOfCity(true); // change area, compare all again
      setTimeout(() => {
        this.updateTotalPrice();
      }, 1000);
    }
  }

  selectCompany(val: any, i: number) {
    this.cart.products[i].pickUpAddress = {};
    this.cart.products[i].deliveryCompanyId = val;
    const deliveryCompany = _.find(this.companies, (e) => e._id === val);
    if (deliveryCompany) {
      this.cart.products[i].deliveryPrice = deliveryCompany.deliveryPrice;
    }
    this.cart.products[i].isCompareZone = false;
    // Get zones of city when change company
    this.getZoneOfCity(false);  // change company, not compare all again
    setTimeout(() => {
      this.updateTotalPrice();
    }, 1000);
  }

  trackDial(string: any) {
    const validDials = this.dialCodes.filter(d => d.dialCode);
    validDials.forEach(d => {
      const i = string.indexOf(d.dialCode);
      if (i > -1) {
        const p = string.split(d.dialCode);
        this.mobile = {
          dial: d.dialCode,
          number: p[1]
        };
      }
    });
  }

  // Get zone when user select city,
  getZoneOfCity(isChangeLocation: boolean) {
    if (!this.userInfo.city) {
      return this.toasty.error('Please select city to calculate delivery price!');
    }
    this.cart.products.forEach((item) => {
      if (isChangeLocation) { // when user change city/area, we will compare all again.
        item.isCompareZone = false;
      }
      if (!item.isPickUpAtStore && item.deliveryCompanyId && !item.isCompareZone) {
        this.companyService.getZoneByArea(item.deliveryCompanyId, { city: this.userInfo.city }).then(resp => {
          item.zones = resp.data.items;
          this.compareZone(item);
        });
      }
    });
  }

  // Show toasty when click radio button delivery
  showToasty(item: any) {
    if (!item.isPickUpAtStore && !item.deliveryCompanyId) {
      return this.toasty.error('Please select delivery company for product ' + item.product.name + ' to calculate delivery price!');
    }
  }

  compareZone(product: any) {
    const isFound = []; // found item in zones array. if have = true, else = false
    if (product.zones.length <= 0) {
      product.deliveryZonePrice = 0;
      return this.toasty.error(product.product.name + ': This delivery company does not support in your area, please choose another delivery company');
    }
    product.isCompareZone = true;
    product.zones.forEach((item, index) => {
      if (item.areas.length > 0 && item.areas.indexOf(this.userInfo.area) > -1) {
        product.deliveryZoneId = item._id;
        product.deliveryZonePrice = item.deliveryPrice;
        isFound[index] = true;
      } else if (item.areas.length <= 0 && !this.userInfo.area) {
        product.deliveryZoneId = item._id;
        product.deliveryZonePrice = item.deliveryPrice;
        isFound[index] = true;
      } else {
        isFound[index] = false;
      }
    });
    setTimeout(() => {
      if (isFound.indexOf(true) === -1) {
        product.deliveryZonePrice = 0;
        return this.toasty.error(product.product.name + ': This delivery company does not support in your area, please choose another delivery company');
      }
    }, 500);
  }

  selectPickUpAddress(pickUpAddressObj: any, index: number, type: string) {
    if (type === 'delivery') {
      this.cart.products[index].pickUpAddressObj = pickUpAddressObj;
      this.cart.products[index].pickUpAddress = {};
    }
    if (type === 'pickUpAtStore') {
      if (pickUpAddressObj.id) {
        let shopAddress = {
          street: pickUpAddressObj.address ? pickUpAddressObj.address : '',
          area: pickUpAddressObj.state ? pickUpAddressObj.state : '',
          city: pickUpAddressObj.city ? pickUpAddressObj.city : ''
        };
        this.cart.products[index].pickUpAddressObj = {};
        this.cart.products[index].pickUpAddress = shopAddress;
      } else {
        this.cart.products[index].pickUpAddressObj = {};
        this.cart.products[index].pickUpAddress = pickUpAddressObj;
      }
    }
  }
}
