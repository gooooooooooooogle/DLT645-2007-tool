import { Message } from 'element-ui'

const SerialPort = require('serialport')

let _sp = null;

export default {
  buf2hex(buffer) {
    return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
  },
  getComList() {
    return SerialPort.list()
  },
  initSP(comName, openOptions) {
    let options = {
      ...openOptions,
      autoOpen: false,
      dataBits: 8,
      stopBits: 1,
      xon: false,
      xoff: false,
      xany: false,
      rtscts: false,
    };
    _sp = new SerialPort(comName, options)
    return _sp
  },
  openSP() {
    this.closeSP();
    _sp.open((err) => {
      if (err) {
        Message({
          message: "打开串口失败！" + err.message,
          type: "error",
        });
      }
    });
  },
  closeSP() {
    if (_sp.isOpen) _sp.close();
  },
  sendData(data) {
    _sp.write(data, "hex", (err) => {
      if (err) {
        Message({
          message: "发送数据失败",
          type: "error",
        });
      }
    });
  },
  receiveData(cb) {
    _sp.on("data", (data) => {
      let receiveDataStr = this.buf2hex(data).toUpperCase();
      cb(receiveDataStr)
    });
  }
}