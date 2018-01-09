import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Market } from '@ionic-native/market';
import { File } from '@ionic-native/file';
import { Device } from '@ionic-native/device';
import { Ads } from "../services/ads";
import { AppUpdate } from '@ionic-native/app-update';
import { SocialSharing } from '@ionic-native/social-sharing';

import { HomePage } from '../pages/home/home';
import { OtherPage } from '../pages/other/other';

declare var FacebookAds: any;
declare var MoPub: any;

@Component({
  templateUrl: 'app.html'
})

export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;
  pages: Array<{ title: string, component: any, pageValue: number}>;
  start: boolean;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, 
    public alert: AlertController, public fileNavigator: File, private ads: Ads, private socialSharing: SocialSharing,
    private market: Market, private device: Device, private appUpdate: AppUpdate) {

    this.initializeApp();
    
    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Status', component: HomePage, pageValue: 1 },
      { title: 'Shayari', component: OtherPage, pageValue: 2 },
      { title: 'Jokes', component: OtherPage, pageValue: 3 },
      { title: 'Quotes', component: OtherPage, pageValue: 5 },
      { title: 'Group Links', component: OtherPage, pageValue: 4 }
    ];

  }

  deletePreviousThumbnailFiles() {
    this.fileNavigator.removeRecursively(this.fileNavigator.externalApplicationStorageDirectory + 'files/files/', 'videos').
      then((result) => {
        console.log('Directory deleted' + JSON.stringify(result));
      }).
      catch((err) => {
        console.log('Directory not deleted' + JSON.stringify(err));
      });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      console.log('Device UUID is: ' + this.device.uuid);

      // check if latest app is available
      this.checkLatestApp();

      // deleting video thumbnail files from cache
      this.deletePreviousThumbnailFiles();

      // Advertisement network events
      this.ads.registerAdEvents();
      
      this.statusBar.styleDefault();
      this.splashScreen.hide();

    });
  }

  checkLatestApp() {
    // to auto update app
    const updateUrl = 'https://drive.google.com/uc?export=download&id=1FEQhLC1FvVHsIh54MjlpnB2DqNy46d9c';
    this.appUpdate.checkAppUpdate(updateUrl).then((result) => {
      console.log("app update result" + JSON.stringify(result));
    }).catch((error) => {
      console.log("app update error" + JSON.stringify(error));
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    //  this.nav.setRoot(page.component);

    this.nav.push(page.component, {
      pageTitle: page.title,
      pageValue: page.pageValue
    });
  }

  exit() {
    let alert = this.alert.create({
      title: 'Do you want to exit?',
      buttons: [{
        text: "Rate App",
        handler: () => { this.openApp('io.ionic.whatsappkhajana') }
      },
      {
        text: "exit",
        handler: () => { 
          this.ads.showInterstitialAdMob();
          setTimeout(()=> {
            this.exitApp();
          }, 1000);
         }
      }]
    })
    alert.present();
  }

  exitApp() {
    this.platform.exitApp();
  }

  openApp(name) {
    this.market.open(name);
  }

  shareApp(text) {
    this.socialSharing.share(text, '', '', '').then(() => {
      console.log("suceesfully shared");
    }).catch((e) => {
      console.log("error while sharing" + e);
    });
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
