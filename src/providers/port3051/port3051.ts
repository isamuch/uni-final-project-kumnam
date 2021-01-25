import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class Port3051Provider {

  constructor(public http: Http) {

  }

  //SETTING HOME (NORMAL)
  //PASS
  settingHomeNormal(homeName, inoutActive, outlineActive, outlineWeek) {
    return new Promise((resolve, reject) => {
      let jwt = localStorage.getItem('jwt');
      let header = new Headers({
        'Content-Type': 'application/json',
        'Authorization': jwt,
      })

      let options = new RequestOptions({ headers: header });
      let body = {
        homeID: localStorage.getItem('homeID'),
        homeName: homeName,
        inoutActive: inoutActive,
        outlineActive: outlineActive,
        outlineWeek: outlineWeek,
      }

      this.http.patch("http://kumnam.me:3051/setting/setHome", body, options)
        .map(res => res.text())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  //GET LOG
  //PASS
  getLog() {
    return new Promise((resolve, reject) => {
      let jwt = localStorage.getItem('jwt');
      let _homeID = localStorage.getItem('homeID');

      let headers = new Headers({
        'Content-Type': 'application/json',
        'Authorization': jwt
      });
      let body = {
        homeID: _homeID,
      };
      let options = new RequestOptions({ headers: headers });

      this.http.post("http://kumnam.me:3051/detect/getLog", body, options)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
          console.log(data);
        }, error => {
          reject(error);
          console.log("fuck2");

        });
    });
  }

  //SETTING HOME (UNIT SET)
  //PASS
  setCostRate(costRate) {
    return new Promise((resolve, reject) => {

      let jwt = localStorage.getItem('jwt');
      let header = new Headers({
        'Content-Type': 'application/json',
        'Authorization': jwt,
      })

      let options = new RequestOptions({ headers: header });
      let body = {
        costArray: costRate,
        homeID: localStorage.getItem('homeID')
      }

      this.http.patch("http://kumnam.me:3051/setting/setCostRate", body, options)
        .map(res => res.text())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  //ADD MEMBER
  addMember(memberEmail) {
    return new Promise((resolve, reject) => {
      let jwt = localStorage.getItem('jwt');
      let _homeID = localStorage.getItem('homeID');
      let _email = localStorage.getItem('email');

      let headers = new Headers({
        'Content-Type': 'application/json',
        'Authorization': jwt
      });
      let body = {
        homeID: _homeID,
        ownerEmail: _email,
        addUserEmail: memberEmail
      };
      let options = new RequestOptions({ headers: headers });

      this.http.post("http://kumnam.me:3051/users/addUser", body, options)
        .map(res => res.text())
        .subscribe(data => {
          resolve(data);
          console.log(data);
        }, error => {
          reject(error);
          console.log(error);

        });
    });
  }

    //DELETE MEMBER
    delMember(memberEmail) {
      return new Promise((resolve, reject) => {
        let jwt = localStorage.getItem('jwt');
        let _homeID = localStorage.getItem('homeID');
        let _email = localStorage.getItem('email');
  
        let headers = new Headers({
          'Content-Type': 'application/json',
          'Authorization': jwt
        });
        let body = {
          homeID: _homeID,
          ownerEmail: _email,
          delUserEmail: memberEmail
        };
        let options = new RequestOptions({ headers: headers });
  
        this.http.post("http://kumnam.me:3051/users/delUser", body, options)
          .map(res => res.text())
          .subscribe(data => {
            resolve(data);
            console.log(data);
          }, error => {
            reject(error);
            console.log(error);
  
          });
      });
    }



}
