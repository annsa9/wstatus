import { Injectable } from '@angular/core';
import { AlertController, Platform, Events } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { SQLitePorter } from '@ionic-native/sqlite-porter';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class Database {

    private isOpen: boolean;
    public database: SQLiteObject;
    public isDatabaseConnectionOpen: boolean = false;
    public isDatabaseDataExist: boolean = false;
    
    public constructor(public alert: AlertController, private sqlite: SQLite, public events: Events,
        private sqlitePorter: SQLitePorter, private http: Http, public platform: Platform) {
        this.platform.ready().then(() => {
            if (!this.isOpen) {
                this.sqlite.create({
                    name: 'wstatus.db',
                    location: 'default'
                })
                    .then((db: SQLiteObject) => {
                        this.database = db;
                        this.isDatabaseConnectionOpen = true;
                        this.events.publish('database_connection_open');
                        this.isDatabaseExist();

                        this.events.subscribe('database_return', (value) => {
                            if (value) {
                                this.isDatabaseDataExist = true;
                                this.events.publish('database_exists');
                            } else {
                                this.fillDatabase();
                            }
                        });

                        this.isOpen = true;
                    })
                    .catch(e => this.showAlert('db err' + e));
            }
        });
    }


    public fillDatabase() {
        this.http.get('assets/wstatus_new_db.sql')
            .map(res => res.text())
            .subscribe(sql => {
                this.sqlitePorter.importSqlToDb(this.database, sql)
                    .then(data => {
                       // this.showAlert('sql import success ' + JSON.stringify(data));
                        this.isDatabaseDataExist = true;
                        this.events.publish('database_imported');
                    })
                    .catch(e => this.showAlert("error" + JSON.stringify(e)));
            });
    }

    public getSubCategories(langId) {
        return new Promise((resolve, reject) => {
            this.database.executeSql('select * from w_sub_category where sub_cat_lang = ?', [langId]).then((data) => {
                let sub_cat = [];
                if (data.rows.length > 0) {
                    for (var i = 0; i < data.rows.length; i++) {
                        sub_cat.push(data.rows.item(i));
                        console.log('Executed SQL');
                    }
                }
                resolve(sub_cat);
            }, (error) => {
                this.showAlert('inside statement error ' + JSON.stringify(error));
                reject(error);
            });
        });
    }

    public getLanguages() {
        return new Promise((resolve, reject) => {
            this.database.executeSql('select * from w_lang', []).then((data) => {
                let languages = [];
                if (data.rows.length > 0) {
                    for (var i = 0; i < data.rows.length; i++) {
                        languages.push(data.rows.item(i));
                    }
                }
                resolve(languages);
            }, (error) => {
                reject(error);
            });
        });
    }

    public showAlert(message) {
        let alert = this.alert.create({
            title: '',
            subTitle: message,
            buttons: ['OK']
        });
        alert.present();
    }

    public isDatabaseExist() {
        this.database.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name='w_sub_category'", []).then((data) => {
            if (data.rows.length > 0) {
                this.isDatabaseDataExist = true;
                this.events.publish('database_return', true);
            } else {
                this.events.publish('database_return', false);
            }
        }, (error) => {
            this.showAlert('error in creating database' + JSON.stringify(error));
            this.events.publish('database_return', false);
        });
    }

    public getStatuses(subCategoryId) {
        return new Promise((resolve, reject) => {
            this.database.executeSql('select * from w_content where sub_cat_id = ? ORDER BY content_id DESC', [subCategoryId]).then((data) => {
                let statuses = [];
                if (data.rows.length > 0) {
                    for (var i = 0; i < data.rows.length; i++) {
                        statuses.push(data.rows.item(i));
                        console.log('Executed SQL');
                    }
                }
                resolve(statuses);
            }, (error) => {
                this.showAlert('inside statement error ' + JSON.stringify(error));
                reject(error);
            });
        });
    }

    public getOthers(otherId) {
        let tableName: string;
        let order: string;
        switch (otherId) {
            case 2: {
                tableName = 'w_Shayari';
                order = 's_id';
                break;
            } 
            case 3: {
                tableName = 'w_jokes';
                order = 'joke_id';
                break;
            } 
            case 4: {
                tableName = 'w_group_links';
                order = 'link_id';
                break;
            } 
            case 5: {
                tableName = 'w_quotes';
                order = 'q_id';
                break;
            } 
            default: {
                //statements; 
                break;
            } 

        }
        return new Promise((resolve, reject) => {
            this.database.executeSql('select * from ' +tableName+ ' ORDER BY '+order+' DESC', []).then((data) => {
                let others = [];
                if (data.rows.length > 0) {
                    for (var i = 0; i < data.rows.length; i++) {
                        others.push(data.rows.item(i));
                        console.log('Executed SQL');
                    }
                }
                resolve(others);
            }, (error) => {
                this.showAlert('inside statement error ' + JSON.stringify(error));
                reject(error);
            });
        });
    }

}