import { Injectable, } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

// import =========================================
import * as io from "socket.io-client";

@Injectable()
export class Port4000Provider {

  socket: io.Socket;
  data: Array<any> = [];
  dataChart: Array<{
    data: Array<any>;
  }> = [];

  constructor(public http: Http, ) {

  }

  //[{data:[1,2,3,4]},]

  //SOCKET-IO SERVER REAL TIME DATA FROM ARDUINO
  //PASS
  realTimeDataFromArduino() {
    let homeID = localStorage.getItem('homeID');
    this.socket = io('http://kumnam.me:4000');

    this.socket.on('connect', () => {
      this.socket.emit('create', homeID);
      this.socket.on('added', (data) => {
        let realData = ((data.data / 1000) * 60).toFixed(2);
        console.log("fuck from port4000");
        this.data[data.deviceID] = realData;
        //this.dataChart[data.deviceID].data.push();
      });
    });
  }

}
