import utils from "../utils"
import moment from 'moment'

export const set645Frame = (cmdName, meterAddr, rwType, di, pass1, pass2, oper, data) => {
  const startFlag = '68'
  const endFlag = '16'
  let controlCode = ''
  let dataLen = ''
  let dataArea = ''
  if (rwType === '设置') {
    controlCode = '14'
    dataArea = utils.reverseStr(di) + pass1 + utils.reverseStr(pass2) + utils.reverseStr(oper) + utils.reverseStr(data)
  }
  else if (rwType === '读取') {
    controlCode = '11'
    dataArea = utils.reverseStr(di)
  }

  dataArea = utils.action33(dataArea, 'add')
  dataLen = utils.intToHex(dataArea.length / 2, 2)

  let cs = utils.getCheck(startFlag + meterAddr + startFlag + controlCode + dataLen + dataArea)
  let sendFrame = startFlag + utils.reverseStr(meterAddr) + startFlag + controlCode + dataLen + dataArea + cs + endFlag;
  let special = specialSendFrame(cmdName)
  if (special !== '') sendFrame = special
  return sendFrame
}

export const analysis645Frame = (cmdName, receiveFrame, rwType) => {
  while (receiveFrame.substr(0, 2) === 'FE') {
    receiveFrame = receiveFrame.slice(2)
  }
  const meterAddr = utils.reverseStr(receiveFrame.substr(2, 12))
  const controlCode = receiveFrame.substr(16, 2)
  let result
  let di = ''
  let dataArea = '无'
  let dataLen = receiveFrame.substr(18, 2)
  dataLen = utils.hexToInt(dataLen)
  if (rwType === '读取') {
    if (controlCode === '91') {
      result = '成功'
      di = utils.reverseStr(utils.action33(receiveFrame.substr(20, 8), 'less'))
      dataArea = receiveFrame.substr(28, receiveFrame.length - 32)
      dataArea = utils.action33(dataArea, 'less')
    }
    else {
      result = '失败'
    }
  } else if (rwType === '设置') {
    if (controlCode === '94') {
      result = '成功'
    }
    else {
      result = '失败'
    }
  }
  const cs = receiveFrame.slice(-4).substr(0, 2)

  // 特殊处理
  if ((cmdName === '读取表号') && (controlCode === '93')) {
    dataArea = meterAddr
    result = '成功'
  }

  return {
    meterAddr,
    cmdName,
    result,
    controlCode,
    dataLen,
    di,
    dataArea,
    cs,
    receiveFrame,
    date: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
  }
}

export const specialSendFrame = (cmdName) => {
  let result = ''
  if (cmdName === '读取表号') result = 'FEFEFEFE68AAAAAAAAAAAA681300DF16'
  return result
}

export const specialData = (data) => {
  let result = ''
  if (data.substr(0, 1) === '{') data = JSON.parse(data)
  if (data instanceof Object) {
    if (data.type === 'time') {
      if (data.data === 'YYMMDDWW') {
        let now = moment(new Date()).format('YYMMDD')
        let week = moment(new Date()).day().toString()
        week = utils.padLeftStr(week, 2, '0')
        result = now + week
      } else if (data.data === 'YYMMDDWWHHmmss') {
        let now = moment(new Date()).format('YYMMDDHHmmss')
        let week = moment(new Date()).day().toString()
        week = utils.padLeftStr(week, 2, '0')
        result = now.substr(0, 6) + week + now.substr(6, 6)
      }
      else {
        result = moment(new Date()).format(data.data)
      }
    } else if (data.type === 'ascill') {
      result = utils.asciiStrToHexStr(data.data)
    }
  } else {
    if (typeof data === 'string') {
      result = data
    }
  }
  return result
}