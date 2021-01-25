import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class Port3030Provider {

  constructor(public http: Http) {
  }

  //GET DEVICES BY HOME{ID}
  //PASS
  getDevicesByHomeID() {
    return new Promise((resolve, reject) => {
      let _homeID = localStorage.getItem('homeID');
      let jwt = localStorage.getItem('jwt');

      let headers = new Headers({
        'Content-Type': 'application/json',
        'Authorization': jwt,
      })
      let options = new RequestOptions({ headers: headers });

      this.http.get("http://kumnam.me:3030/devices/" + _homeID, options)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  //UPDATE DEVICE
  //PASS
  upDateDevice(deviceID, deviceName, deviceLocation) {
    return new Promise((resolve, reject) => {
      let jwt = localStorage.getItem('jwt');
      let _deviceID = deviceID;
      let _deviceName = deviceName;
      let _locationDevice = deviceLocation;

      let headers = new Headers({
        'Content-Type': 'application/json',
        'Authorization': jwt
      });

      let body = {
        id: _deviceID,
        name: _deviceName,
        location: _locationDevice
      };
      let options = new RequestOptions({ headers: headers });

      this.http.patch("http://kumnam.me:3030/updateDevice", body, options)
        .map(res => res.text())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  //ADD DEVICE TO HOME
  //PASS
  addDeviceToHome(deviceID, deviceName, deviceLocation, parentID) {
    return new Promise((resolve, reject) => {
      let jwt = localStorage.getItem('jwt');
      let _deviceID = deviceID;
      let _deviceName = deviceName;
      let _deviceLocation = deviceLocation;
      let _parentID = parentID;

      let headers = new Headers({
        'Content-Type': 'application/json',
        'Authorization': jwt
      });
      let body = {
        homeID: localStorage.getItem('homeID'),
        id: _deviceID,
        name: _deviceName,
        location: _deviceLocation,
        parentID: _parentID,
      };
      let options = new RequestOptions({ headers: headers });
      
      this.http.put("http://kumnam.me:3030/user/addDevice", body, options)
        .map(res => res.text())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  //DELETE DEVICe
  //PASS
  deleteDevice(deviceID) {
    return new Promise((resolve, reject) => {
      let jwt = localStorage.getItem('jwt');
      let _homeID = localStorage.getItem('homeID');
      let _deviceID = deviceID;
      let headers = new Headers({
        'Content-Type': 'application/json',
        'Authorization': jwt,
      })

      let body = {
        homeID: _homeID,
        id: _deviceID,
      };
      let options = new RequestOptions({ headers: headers });

      this.http.patch("http://kumnam.me:3030/user/delDevice", body, options)
        .map(res => res.text())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });

  }

  //DETECT OFF
  //PASS
  detecOff(devicesID, detectBy, logToken) {
    return new Promise((resolve, reject) => {
      let jwt = localStorage.getItem('jwt');
      let _deviceID = devicesID;
      let _homId = localStorage.getItem('homeID');
      let _detectBy = detectBy;
      let _logToken = logToken;

      let headers = new Headers({
        'Content-Type': 'application/json',
        'Authorization': jwt
      });

      let body = {
        devicesID: _deviceID,
        homeID: _homId,
        detectBy: _detectBy,
        logToken: _logToken
      };      
      let options = new RequestOptions({ headers: headers });

      this.http.patch("http://kumnam.me:3030/detect/off", body, options)
        .map(res => res.text())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  //DETECT ON
  //PASS
  detecOn(devicesID, detectBy, logToken) {
    return new Promise((resolve, reject) => {      
      let jwt = localStorage.getItem('jwt');
      let _deviceID = devicesID;
      let _homId = localStorage.getItem('homeID');
      let _detectBy = detectBy;
      let _logToken = logToken;

      let headers = new Headers({
        'Content-Type': 'application/json',
        'Authorization': jwt
      });

      let body = {
        devicesID: _deviceID,
        homeID: _homId,
        detectBy: _detectBy,
        logToken: _logToken
      };

      console.log(body);
      let options = new RequestOptions({ headers: headers });

      this.http.patch("http://kumnam.me:3030/detect/on", body, options)
        .map(res => res.text())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  //GET OUTLINE BY HOME ID
  //PASS
  getOutlineByHomeID() {
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
      
      this.http.post("http://kumnam.me:3030/detect/getOutlineByHomeID", body, options)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
          console.log("fuck2");
        });
    });
  }

  //GET PATTERN BY HOME ID
  //PASS
  getPatternByDeviceID(deviceID) {
    return new Promise((resolve, reject) => {
      let jwt = localStorage.getItem('jwt');
      let _homeID = localStorage.getItem('homeID');
      let _deviceID = deviceID;

      let headers = new Headers({
        'Content-Type': 'application/json',
        'Authorization': jwt
      });
      let body = {
        homeID: _homeID,
        deviceID: _deviceID,
      };
      let options = new RequestOptions({ headers: headers });
      
      this.http.post("http://kumnam.me:3030/detect/getPatternByDeviceID", body, options)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);

          console.log("fuck2");
        });
    });
  }

  //RESET PATTERN BY DEVICE ID

  delPattern(deviceID) {
    return new Promise((resolve, reject) => {
      let jwt = localStorage.getItem('jwt');
      let _homeID = localStorage.getItem('homeID');
      let _deviceID = deviceID;

      let headers = new Headers({
        'Content-Type': 'application/json',
        'Authorization': jwt
      });
      let body = {
        homeID: _homeID,
        deviceID: _deviceID,
      };
      let options = new RequestOptions({ headers: headers });

      
      this.http.post("http://kumnam.me:3030/detect/delOutline", body, options)
        .map(res => res.text())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
          console.log("fuck2");
        });
      
    });
  }



}
