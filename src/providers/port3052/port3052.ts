import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class Port3052Provider {

  constructor(public http: Http) {
  }

  //GET BY DAT
  //PASS
  getByDay(dayText) {
    return new Promise((resolve, reject) => {
      let jwt = localStorage.getItem('jwt');
      let _homeID = localStorage.getItem('homeID');
      let _dayText = dayText;

      let headers = new Headers({
        'Content-Type': 'application/json',
        'Authorization': jwt
      });
      let body = {
        homeID: _homeID,
        dayText: _dayText,
      };
      let options = new RequestOptions({ headers: headers });
      
      this.http.post("http://kumnam.me:3052/history/getByDay", body, options)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  //GET BY MONTH
  //PASS
  getByMonth(monthText) {
    return new Promise((resolve, reject) => {
      let jwt = localStorage.getItem('jwt');
      let _homeID = localStorage.getItem('homeID');
      let _monthText = monthText;

      let headers = new Headers({
        'Content-Type': 'application/json',
        'Authorization': jwt
      });
      let body = {
        homeID: _homeID,
        monthText: _monthText,
      };
      let options = new RequestOptions({ headers: headers });
      
      this.http.post("http://kumnam.me:3052/history/getByMonth", body, options)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

}
