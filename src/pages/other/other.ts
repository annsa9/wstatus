import { Component } from '@angular/core';
import { NavController, Platform, AlertController, NavParams } from 'ionic-angular';
import { Toast } from '@ionic-native/toast';
import { Database } from "../../services/database";
import { Ads } from "../../services/ads";

import { OtherViewPage } from '../other.view/other.view';

@Component({
  selector: 'page-other',
  templateUrl: 'other.html'
})

export class OtherPage {

  pageValue: number;
  pageTitle: string;
  others: any = [];
  
  constructor(public navCtrl: NavController, public platform: Platform, private navParams: NavParams,
    public alert: AlertController, private database: Database, private toast: Toast, private ads: Ads) {

    this.pageValue = navParams.get('pageValue');
    this.pageTitle = navParams.get('pageTitle');

    this.platform.ready().then(() => {
      this.ads.showAdmobBannerAdMob();
      this.getOthers(this.pageValue);
    });
  }

  getOthers(pageValue) {
    this.database.getOthers(pageValue).then((result) => {
      this.others = result;
    }, (error) => {
    //  this.showAlert("ERROR: " + error);
    });
  }

  showOtherView(other) {
    this.navCtrl.push(OtherViewPage, {
      other: other,
      pageValue: this.pageValue,
      pageTitle: this.pageTitle
    });
  }

  pressEvent(e) {
    this.toast.show('Click on item to share/copy', '2000', 'top').subscribe(
      toast => {
        console.log(toast);
      }
    );
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
