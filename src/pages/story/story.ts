import { Component } from '@angular/core';
import { NavController, Platform, AlertController } from 'ionic-angular';
import { NavParams } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { SocialSharing } from '@ionic-native/social-sharing';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';

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
    private transfer: FileTransfer
  ) {
    
    this.platform.ready().then(() => {
      this.mediaUrl = navParams.get('mediaUrl');
      this.mediaName = navParams.get('mediaName');
      this.mediaExt = navParams.get('mediaExt');
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
    // Check if sharing via email is supported
    this.socialSharing.share('', '', fileData,'' ).then(() => {
      // Sharing via email is possible
      console.log("suceesfully shared");
    }).catch((e) => {
      // Sharing via email is not possible
      console.log("error while sharing"+e);
    });
  }

  downloadStory() {
    const url = this.mediaUrl;
    const fileTransfer: FileTransferObject = this.transfer.create();
    const fileTransferDir = this.fileNavigator.externalRootDirectory;
    const fileURL = fileTransferDir + 'Download/' + this.mediaName;        

    //fileTransfer.download(url, this.fileNavigator.dataDirectory + 'test.jpg').then((entry) => {
    fileTransfer.download(url, fileURL).then((entry) => {
      console.log('download complete: ' + entry.toURL() + ' data dir: ' + this.fileNavigator.externalRootDirectory);
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

}
