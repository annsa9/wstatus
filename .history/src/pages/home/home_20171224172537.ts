import { Component } from '@angular/core';
import { NavController, Platform, AlertController } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { VideoEditor } from '@ionic-native/video-editor';

import { StoryPage } from '../story/story';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  language: string = "hindi";
  androidPermission: boolean;
  entries: any;
  statuses: any = [];
  nameArray: any = [];
  allComplete: boolean = false;
  count: number = 0;
  
  constructor(public navCtrl: NavController, public platform: Platform, public fileNavigator: File, 
    public alert: AlertController, private androidPermissions: AndroidPermissions,
    private videoEditor: VideoEditor) {
    const MEDIA_DIRECTORY = 'WhatsApp/Media/.Statuses';

 //   this.showAlert(this.fileNavigator.externalApplicationStorageDirectory);
    this.platform.ready().then(() => {
      this.checkPermission();
      this.listDir('file:///storage/emulated/0/', MEDIA_DIRECTORY);
    });
  }

  listDir(path, dirName) {
    this.fileNavigator.listDir(path, dirName)
      .then((entries) => {
        this.entries = entries;
        for (var i = 0, len = entries.length; i < len; i++) {
          let fileExtension = this.nameSplit(this.entries[i].name);
          Object.assign(this.entries[i], { extension: fileExtension });

          if (this.entries[i].extension == 'mp4') {
            this.createThumbnailG(this.entries, i, len);
          } else {
            this.count++;
          }
        }
        this.showAlert(this.count+" "+(len - 1));
        this.allComplete = true; 
        // this.showAlert('all complete');
        this.statuses = this.entries;
        console.log('status fetched');
      })
      .catch(e => console.log('status not fetched' + JSON.stringify(e) ));
  }

  nameSplit(name) {
    this.nameArray = name.split('.');
    console.log(this.nameArray[1]);
    return this.nameArray[1];
  }

  checkPermission() {
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE).then(
      (result) => {
        if (result.hasPermission) {
          this.androidPermission = true;
        } else {
          this.androidPermission = false;
        }
      },
      err => console.log(err)
    );
  }

  requestPermission() {
    this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE,
    this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE]).then (
      (result) => {
        if (result.hasPermission) {
          this.androidPermission = true;
        } else {
          this.androidPermission = false;
        }
        this.listDir('file:///storage/emulated/0/', 'WhatsApp/Media/.Statuses');
      },
      err => console.log('error in requesting permssion')
    );
  }

  setMedia(url, fileName, extension) {
    this.navCtrl.push(StoryPage, {
      mediaUrl: url,
      mediaName: fileName,
      mediaExt: extension
    });
  }

  createThumbnailG(entries, key, length) {
    let remoteFileUrl = entries[key].nativeURL;
    let fileName = entries[key].name;
    this.videoEditor.createThumbnail({
      fileUri: remoteFileUrl,
      outputFileName: fileName
    }).then(
      thumbnail => {
         this.showAlert('success' + key);
         this.entries[key].nativeURLvid = thumbnail;
         this.count++;
        },
      error => { 
        this.showAlert('error' + error);
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
