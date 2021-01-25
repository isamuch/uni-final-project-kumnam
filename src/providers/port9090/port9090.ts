import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class Port9090Provider {

  constructor(public http: Http) {
  }

  //TURN OFF DEVICE
  //PASS
  turnOffDevice(idDevice, email, homeID, deviceName) {
    return new Promise((resolve, reject) => {

      let jwt = localStorage.getItem('jwt');
      let headers = new Headers({
        'Content-Type': 'application/json',
        'Authorization': jwt,
      })
      let body = {
        id: idDevice,
        email: email,
        time: new Date(),
        room: homeID,
        deviceName: deviceName
      };
      let options = new RequestOptions({ headers: headers });

      this.http.patch("http://kumnam.me:9090/off", body, options)
        .map(res => res.text())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  //TURN ON DEVICE
  //PASS
  turnOnDevice(idDevice, email, homeID, deviceName) {
    return new Promise((resolve, reject) => {

      let jwt = localStorage.getItem('jwt');
      let headers = new Headers({
        'Content-Type': 'application/json',
        'Authorization': jwt,
      })
      let body = {
        id: idDevice,
        email: email,
        time: new Date(),
        room: homeID,
        deviceName: deviceName
      };

      let options = new RequestOptions({ headers: headers });

      this.http.patch("http://kumnam.me:9090/on", body, options)
        .map(res => res.text())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }




}
