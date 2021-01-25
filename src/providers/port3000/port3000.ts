import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class Port3000Provider {

  constructor(public http: Http) {
  }

  //LOGIN GET JWT
  //PASS
  loginGetJWT(email: string, password: string) {
    return new Promise((resolve, reject) => {

      let headers = new Headers({ 'content-type': 'application/json' });
      let options = new RequestOptions({ headers: headers });
      let body = { email: email, password: password };

      this.http.post('http://kumnam.me:3000/genToken', body, options)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    })
  }

  //GENARATE NEW TOKEN
  //PASS
  genNewToken() {
    return new Promise((resolve, reject) => {
      let headers = new Headers({ 'content-type': 'application/json' });
      let options = new RequestOptions({ headers: headers });
      let email = localStorage.getItem('email');
      let refreshToken = localStorage.getItem('token');
      let body = { email: email, refreshToken: refreshToken };

      this.http.post("http://kumnam.me:3000/genNewToken", body, options)
        .map(res => res.text())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  //CHECK STATE
  //PASS
  checkState() {
    return new Promise((resolve, reject) => {
      let headers = new Headers({
        'content-type': 'application/json',
        'Authorization': localStorage.getItem('jwt')
      });
      let options = new RequestOptions({ headers: headers });

      this.http.get("http://kumnam.me:3000/checkAuth", options)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }


  //GET USER INFORMATION
  //PASS
  getUserInformation() {
    return new Promise((resolve, reject) => {
      let jwt = localStorage.getItem('jwt');
      let token = localStorage.getItem('token');
      let headers = new Headers({
        'Content-Type': 'application/json',
        'Authorization': jwt,
      })

      let body = { token: token };

      let options = new RequestOptions({ headers: headers });

      this.http.patch("http://kumnam.me:3000/checkUser", body, options)
        .map(res => res.json())
        .subscribe((data: any) => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

}
