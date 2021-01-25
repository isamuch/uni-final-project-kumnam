import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import * as io from 'socket.io-client';


@Injectable()
export class Port4040Provider {

  socket: io.Socket;

  constructor(
    public http: Http) {
  }

  //SOCKET-IO SERVER REAL TIME ALERT ON/OFF/DETECT
  //PASS
  realTimeAlert() {

    let homeID = localStorage.getItem('homeID');
    this.socket = io('http://kumnam.me:4040');

    this.socket.on('connect', () => {
      this.socket.emit('create', homeID);
      this.socket.on('on change', (data) => {
        console.log(data);
      });

      this.socket.on('on alert', (data) => {
        console.log(data);
      })

    });
  }


}
