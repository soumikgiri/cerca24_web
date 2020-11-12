import { Component, OnInit } from '@angular/core';
import { SystemService, AuthService } from '../services';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.html'
})
export class FooterComponent implements OnInit {
  public appConfig: any;
  public languages: any = [];
  public userLang: any = 'en';
  public sellerLink = '';
  public socialLinks: any;

  constructor(private systemService: SystemService, private authService: AuthService) {
    this.appConfig = window.appConfig;

    this.systemService.configs().then(resp => {
      if (resp) {
        this.socialLinks = resp.socialLinks;
        this.languages = resp.i18n.languages;
        this.userLang = resp.userLang;
      }
    });
    authService.userLoaded$.subscribe(() => this.updateSellerLink());
  }

  ngOnInit() {
    this.updateSellerLink();
  }

  updateSellerLink() {
    const accessToken = this.authService.getAccessToken();
    this.sellerLink = `${this.appConfig.sellerUrl}?access_token=${accessToken}`;
  }
}
