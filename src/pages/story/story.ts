import { Component } from '@angular/core';
import { NavController, Platform, AlertController } from 'ionic-angular';
import { NavParams } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { SocialSharing } from '@ionic-native/social-sharing';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { Toast } from '@ionic-native/toast';
import { Ads } from "../../services/ads";

@Component({
  selector: 'page-story',
  templateUrl: 'story.html'
})

export class StoryPage {
  mediaUrl: string;
  mediaName: string;
  mediaExt: string;

  constructor(public navCtrl: NavController, public platform: Platform, public fileNavigator: File, 
    public alert: AlertController, private navParams: NavParams, private socialSharing: SocialSharing, 
    private transfer: FileTransfer, private toast: Toast, 
    private ads: Ads
  ) {
    
    this.platform.ready().then(() => {
      this.mediaUrl = navParams.get('mediaUrl');
      this.mediaName = navParams.get('mediaName');
      this.mediaExt = navParams.get('mediaExt');
      this.ads.showAdmobBannerAdMob();
      setTimeout(()=> {
        this.ads.showInterstitialAdMob();
      }, 500);
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

  shareStory(){
    const fileData = this.mediaUrl;
    this.socialSharing.share('', '', fileData,'' ).then(() => {
      this.ads.showVideoAdMob();
      console.log("suceesfully shared");
    }).catch((e) => {
      console.log("error while sharing"+e);
    });
  }

  downloadStory() {

    this.fileNavigator.createDir(this.fileNavigator.externalRootDirectory, 'Whatsapp khajana', false)
      .then((result) => {
        console.log('Directory created' + JSON.stringify(result));
       // this.downloadFile('Download/');
        this.downloadFile('WhatsApp khajana/');
      })
      .catch((err) => {
        console.log('Directory already exist' + JSON.stringify(err));
        this.downloadFile('WhatsApp khajana/');
      });

  }

  downloadFile (directoryName) {
    const url = this.mediaUrl;
    const fileTransfer: FileTransferObject = this.transfer.create();
    const fileTransferDir = this.fileNavigator.externalRootDirectory;
    const fileURL = fileTransferDir + directoryName + this.mediaName;

    fileTransfer.download(url, fileURL).then((entry) => {
      console.log('download complete: ' + entry.toURL() + ' data dir: ' + this.fileNavigator.externalRootDirectory);
      this.toast.show('Downloaded in the Whatsapp khajana folder.', '3000', 'top').subscribe(
        toast => {
          console.log(toast);
        }
      );
      setTimeout(() => {
        this.ads.showInterstitialAdMob();
      }, 1000);
    }, (error) => {
      console.log('Error: ' + error);
      // handle error
    });
  }

  ngOnDestroy() {
    this.mediaUrl = null;
    this.mediaName = null;
    this.mediaExt = null;
  }

  pressEvent(e, button) {
    if (button == 'share') {
      this.toast.show('Share', '2000', 'top').subscribe(
        toast => {
          console.log(toast);
        }
      );
    }
    if (button == 'download') {
      this.toast.show('download', '2000', 'top').subscribe(
        toast => {
          console.log(toast);
        }
      );      
    }

  }

}
