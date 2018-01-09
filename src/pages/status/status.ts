import { Component } from '@angular/core';
import { NavController, Platform, AlertController, NavParams } from 'ionic-angular';
import { Toast } from '@ionic-native/toast';
import { Database } from "../../services/database";
import { Ads } from "../../services/ads";

import { StatusViewPage } from '../status.view/status.view';

@Component({
  selector: 'page-status',
  templateUrl: 'status.html'
})

export class StatusPage {

  subCategoryId: number;
  statuses: any = [];
  
  constructor(public navCtrl: NavController, public platform: Platform, private navParams: NavParams,
    public alert: AlertController, private database: Database, private toast: Toast,
    private ads: Ads) {

    this.platform.ready().then(() => {
      this.subCategoryId = navParams.get('subCategoryId');
      this.getStatuses(this.subCategoryId);
      this.ads.showAdmobBannerAdMob();
    });
  }

  getStatuses(subCategoryId) {
    this.database.getStatuses(subCategoryId).then((result) => {
      this.statuses = result;
    }, (error) => {
    //  this.showAlert("ERROR: " + error);
    });
  }

  showStatus(status) {
    this.navCtrl.push(StatusViewPage, {
      status: status
    });
  }

  pressEvent(e) {
    this.toast.show('Click on item to share/copy status', '2000', 'top').subscribe(
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
