import { Component, ViewChild  } from '@angular/core';
import { Platform, AlertController, NavParams } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Clipboard } from '@ionic-native/clipboard';
import { Toast } from '@ionic-native/toast';
import { Ads } from "../../services/ads";

@Component({
  selector: 'page-status-view',
  templateUrl: 'status.view.html'
})

export class StatusViewPage {

  status: any;
  
  constructor(public platform: Platform, private navParams: NavParams, private toast: Toast,
    public alert: AlertController, private socialSharing: SocialSharing, private clipboard: Clipboard,
    private ads: Ads) {

    this.platform.ready().then(() => {
      this.status = navParams.get('status');
      this.ads.showAdmobBannerAdMob();
    });
  }

  shareStatus(text) {
    this.socialSharing.share(text, '', '', '').then(() => {
      this.ads.showVideoAdMob();
      console.log("suceesfully shared");
    }).catch((e) => {
      console.log("error while sharing" + e);
    });
  }

  copyStatus(text) {
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
