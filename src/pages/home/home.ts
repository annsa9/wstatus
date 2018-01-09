import { Component, ViewChild } from '@angular/core';
import { NavController, Platform, AlertController, Events } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { VideoEditor } from '@ionic-native/video-editor';

import { StoryPage } from '../story/story';
import { StatusPage } from '../status/status';
import { Database } from "../../services/database";
import { Ads } from "../../services/ads";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  languageId: number;
  androidPermission: boolean;
  statusLoad: boolean;
  entries: any;
  statuses: any = [];
  nameArray: any = [];
  videoEntries: any = [];
  langs: any = [];
  subCats: any = [];
  
  constructor(public navCtrl: NavController, public platform: Platform, public fileNavigator: File, 
    public alert: AlertController, private androidPermissions: AndroidPermissions, private ads: Ads,
    private videoEditor: VideoEditor, private database: Database, public events: Events) {

    this.platform.ready().then(() => {

      // check android device permission
      this.checkPermission();

      // first time when user installs app
      events.subscribe('database_imported', () => {
        this.getLanguages();
      });

      // Second time when user opens app, second load
      if(this.database.isDatabaseDataExist) {
          this.getLanguages();
      } else { // Second time first load
        events.subscribe('database_exists', () => {
          this.getLanguages();
        });
      }

      this.ads.showAdmobBannerAdMob();

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
            this.videoEntries.push(this.entries[i]);
          } else {
            this.statuses.push(this.entries[i]);            
          }
        }

      //  this.checkDevicePermission();
        this.statusLoad = true;
        this.createThumbnailG(this.videoEntries, 0);
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
          let MEDIA_DIRECTORY = 'WhatsApp/Media/.Statuses';
          this.listDir('file:///storage/emulated/0/', MEDIA_DIRECTORY); 
        } else {
          this.androidPermission = false;
          this.requestPermission();
        }
      },
      err => {
        this.requestPermission();
        console.log(err);
      }
    );
  }

  requestPermission() {
    this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE,
    this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE]).then (
      (result) => {
        if (result.hasPermission) {
          this.androidPermission = true;
          let MEDIA_DIRECTORY = 'WhatsApp/Media/.Statuses';
          this.listDir('file:///storage/emulated/0/', MEDIA_DIRECTORY);      
        } else {
          this.statusLoad = true;          
          this.androidPermission = false;
        }
      },
      err => {
        console.log('error in requesting permssion');
        this.checkPermission();
        this.statusLoad = true;
      }
    );
  }

  checkDevicePermission() {
    this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE,
    this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE]).then(
      (result) => {
        if (result.hasPermission) {
          this.androidPermission = true;
        } else {
          this.statusLoad = true;
          this.androidPermission = false;
        }
      },
      err => {
        console.log('error in requesting permssion');
        this.statusLoad = true;
      }
      );
  }

  setMedia(url, fileName, extension) {
    this.navCtrl.push(StoryPage, {
      mediaUrl: url,
      mediaName: fileName,
      mediaExt: extension
    });
  }

  showStatuses(subCategoryId) {
    this.navCtrl.push(StatusPage, {
      subCategoryId: subCategoryId
    });
  }

  createThumbnailG(videoEntries, i) {
      let len = videoEntries.length;

      if (len) {
        let remoteFileUrl = videoEntries[i].nativeURL;
        let fileName = videoEntries[i].name;

        this.videoEditor.createThumbnail({
          fileUri: remoteFileUrl,
          outputFileName: fileName,
          atTime: 1, // optional, location in the video to create the thumbnail (in seconds)
          width: 100, // optional, width of the thumbnail
          height: 100, // optional, height of the thumbnail
          quality: 80 // optional, quality of the thumbnail (between 1 and 100)          
        }).then(
          thumbnail => {
              this.videoEntries[i].nativeURLvideo = thumbnail;
              // this.showAlert("ap"+i+JSON.stringify(this.videoEntries[i]));
              this.statuses.push(this.videoEntries[i]);
              if (i == len-1) {
                // Array.prototype.push.apply(this.statuses, this.videoEntries);
              } else {
                i++;
                this.createThumbnailG(this.videoEntries, i);
               // this.events.publish('file_done', i);
              }
          },
          error => {
           // this.showAlert('error' + error);
          }
          );
      }
  }

  getLanguages() {
    this.database.getLanguages().then((result) => {
      this.langs = result;
      this.languageId = 1;
      this.getSubCategories(this.languageId);
    }, (error) => {
     // this.showAlert("ERROR: "+ error);
    });
  }

  langChanged(id) {
    this.languageId = id;
    this.getSubCategories(this.languageId);
  }

  getSubCategories(languageId) {
    this.database.getSubCategories(languageId).then((result) => {
      this.subCats = result;
    }, (error) => {
    //  this.showAlert("ERROR: " + error);
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
