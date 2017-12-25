import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AdMobFree, AdMobFreeBannerConfig } from '@ionic-native/admob-free';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Market } from '@ionic-native/market';
import { SQLitePorter } from '@ionic-native/sqlite-porter';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';

@Component({
  templateUrl: 'app.html'
})

export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, 
    private admobFree: AdMobFree, public alert: AlertController, private sqlite: SQLite,
    private market: Market, private sqlitePorter: SQLitePorter, private http: Http) {

    this.initializeApp();
    
    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Status', component: HomePage },
      { title: 'Shayari', component: ListPage },
      { title: 'Jokes', component: null },
      { title: 'Quotes', component: null },
      { title: 'Group Links', component: null }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      // Make DB
      this.createDbTable();

      // To show banner ad
      this.showAdmobBannerAds();

      //App exit event
      // this.platform.pause.subscribe(() => {
      //   this.exit();
      //  }
      // );

      // to know which platform
      // if (this.platform.is('android')) {
      //   this.showAlert('on android');
      // } else {
      //   console.log('other platform');
      // }
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  showAdmobBannerAds(){
    const bannerConfig: AdMobFreeBannerConfig = {
        id: 'ca-app-pub-6426024580351118/1952160010',
        isTesting: true,
        autoShow: true
    };
    this.admobFree.banner.config(bannerConfig);

    this.admobFree.banner.prepare()
    .then(() => {
        // banner Ad is ready
        // if we set autoShow to false, then we will need to call the show method here
    })
    .catch(e => console.log(e));    
  }

  exit() {
    let alert = this.alert.create({
      title: 'Do you want to exit?',
      buttons: [{
        text: "Rate App",
          handler: () => { this.openApp('com.whatsapp') }
      },
      {
        text: "exit",
        handler: () => { this.exitApp() }
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

  createDbTable(){
    this.sqlite.create({
      name: 'wstatus.db',
      location: 'default'
    })
      .then((db: SQLiteObject) => {
        
       this.showAlert('db created');
       // this.fillDatabase(db);
/*         db.sqlBatch(['create table if not exists w_category(cat_id INTEGER PRIMARY KEY AUTOINCREMENT,category VARCHAR(32))',
          'create table if not exists w_language(lang_id INTEGER PRIMARY KEY AUTOINCREMENT,language VARCHAR(32))',
          'create table if not exists w_sub_category(sub_id INTEGER PRIMARY KEY AUTOINCREMENT,language VARCHAR(32))'])
          .then(() => {
          console.log('Executed SQL');

          this.insertData(db);
          }
          )
          .catch(e => console.log('table not created'+e)); */
      })
      .catch(e => this.showAlert('db err'+e));

  }

  fillDatabase(db) {
    this.http.get('assets/wstatus_db.sql')
      .map(res => res.text())
      .subscribe(sql => {
        this.sqlitePorter.importSqlToDb(db, sql)
          .then(data => {
            this.showAlert('sql import success ' + JSON.stringify(data));
            this.selectQuery(db);
          })
          .catch(e => this.showAlert("error" + JSON.stringify(e)));
      });
  }

  insertData(db){
    db.sqlBatch(["INSERT INTO w_category(category) values('Status')",
      "INSERT INTO w_category(category) values('Shayari')",
      "INSERT INTO w_category(category) values('Jokes')",
      "INSERT INTO w_category(category) values('Quotes')",
      "INSERT INTO w_category(category) values('Group Links')",
      "INSERT INTO w_language(language) values('Hindi')",
      "INSERT INTO w_language(language) values('हिंदी')",
      "INSERT INTO w_language(language) values('मराठी')",
      "INSERT INTO w_language(language) values('தமிழ்')",
      "INSERT INTO w_language(language) values('भोजपुरी')",
      "INSERT INTO w_language(language) values('ਪੰਜਾਬੀ')",
      "INSERT INTO w_language(language) values('राजस्थानी')",
      "INSERT INTO w_language(language) values('اردو')",])
      .then(() => {
      //  this.showAlert('data inserted');

        this.selectQuery(db);
        this.showAlert('Executed SQL insert');
        }
        )
      .catch(e => this.showAlert('data not inserted'+e));
  }

  selectQuery(db){

    this.showAlert('inside select');
    db.executeSql('select * from w_category',[]).then((data) => {
    let cat = [];
      this.showAlert('inside statement '+JSON.stringify(data));
    if (data.rows.length > 0) {
      for (var i = 0; i < data.rows.length; i++) {
        cat.push({ category: data.rows.item(i)});

          console.log('Executed SQL');
      }
      this.showAlert('data view' + JSON.stringify(cat));
    }
   })
      .catch(e => this.showAlert('data not selected'+e)); 
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
