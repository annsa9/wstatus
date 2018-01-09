import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AdMobFree } from '@ionic-native/admob-free';
import { IonAffixModule } from 'ion-affix';
import { Market } from '@ionic-native/market';
import { SQLite } from '@ionic-native/sqlite';
import { File } from '@ionic-native/file';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { SocialSharing } from '@ionic-native/social-sharing';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { VideoEditor } from '@ionic-native/video-editor';
import { SQLitePorter } from '@ionic-native/sqlite-porter';
import { HttpModule } from '@angular/http';
import { Clipboard } from '@ionic-native/clipboard';
import { Toast } from '@ionic-native/toast';
import { Device } from '@ionic-native/device';
import { AppUpdate } from '@ionic-native/app-update';

import { Database } from "../services/database";
import { Ads } from "../services/ads";
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { StoryPage } from '../pages/story/story';
import { StatusPage } from '../pages/status/status';
import { StatusViewPage } from '../pages/status.view/status.view';
import { OtherPage } from '../pages/other/other';
import { OtherViewPage } from '../pages/other.view/other.view';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    StoryPage,
    StatusPage,
    StatusViewPage,
    OtherPage,
    OtherViewPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonAffixModule,
    HttpModule 
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    StoryPage,
    StatusPage,
    StatusViewPage,
    OtherPage,
    OtherViewPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AdMobFree,
    SQLite,
    Market,
    File,
    AndroidPermissions,
    SocialSharing,
    FileTransfer, 
    FileTransferObject,
    VideoEditor,
    SQLitePorter,
    Database,
    Clipboard,
    Toast,
    Ads,
    Device,
    AppUpdate
  ]
})
export class AppModule {}
