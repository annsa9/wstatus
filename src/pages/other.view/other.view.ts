import { Component, ViewChild  } from '@angular/core';
import { Platform, AlertController, NavParams } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Clipboard } from '@ionic-native/clipboard';
import { Toast } from '@ionic-native/toast';
import { Ads } from "../../services/ads";

@Component({
  selector: 'page-other-view',
  templateUrl: 'other.view.html'
})

export class OtherViewPage {

  other: any;
  pageValue: number;
  pageTitle: string;

  
  constructor(public platform: Platform, private navParams: NavParams, private toast: Toast,
    public alert: AlertController, private socialSharing: SocialSharing, private clipboard: Clipboard,
    private ads: Ads) {

    this.other = navParams.get('other');
    this.pageValue = navParams.get('pageValue');
    this.pageTitle = navParams.get('pageTitle');
    
    this.platform.ready().then(() => {
      this.ads.showAdmobBannerAdMob(); 
      setTimeout(() => {
        this.ads.showInterstitialAdMob();
      }, 500);
    });
  }

  shareOther(text) {
    this.socialSharing.share(text, '', '', '').then(() => {
      this.ads.showVideoAdMob();
      console.log("suceesfully shared");
    }).catch((e) => {
      console.log("error while sharing" + e);
    });
  }

  copyOther(text) {
    this.clipboard.copy(text);
    this.toast.show('Copied', '1000', 'top').subscribe(
      toast => {
        console.log(toast);
      }
    );
    this.ads.showInterstitialAdMob();
  }

  showAlert(message) {
    let alert = this.alert.create({
      title: '',
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }

}
