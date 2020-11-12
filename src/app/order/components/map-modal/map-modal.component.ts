import { Component, OnInit, Input, OnDestroy, AfterViewInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastyService } from 'ng2-toasty';

@Component({
  selector: 'map-modal',
  templateUrl: './map.html'
})
export class MapModalComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() orderDetailId: any;
  public position: any = {
    lat: -15.435686,
    lng: 28.352282
  };
  public posInterval: any;
  public iconUrl: any = {
    url: '/assets/images/marker.png',
    scaledSize: {
      width: 40,
      height: 40
    }
  };

  constructor(
    private orderService: OrderService,
    public activeModal: NgbActiveModal, private toasty: ToastyService
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.watchPosition();
    this.posInterval = setInterval(() => {
      this.watchPosition();
    }, 15000);
  }

  ngOnDestroy() {
    clearInterval(this.posInterval);
  }

  watchPosition() {
    this.orderService.location(this.orderDetailId).then(res => {
      if (res.data.driver && res.data.driver[0] && res.data.driver[1]) {
        this.position.lat = res.data.driver[0];
        this.position.lng = res.data.driver[1];
      } else {
        this.activeModal.dismiss('Cross click');
        this.toasty.error("Unable to determine the driver's position!");
      }
    }).catch(err => this.toasty.error(err.data.data.message || 'Something went wrong, please try again'));
  }
}
