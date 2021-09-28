const XLSX = require('xlsx');

export default {
  readExcelData: (excelPath) => {
    const workbook = XLSX.readFile(excelPath)
    const excelData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]])
    return excelData
  },
  formatExcelData: (data) => {
    const tableData = []
    for (const item of data) {
      tableData.push({
        name: item['命令名称'] || '',
        rwType: item['抄编标志'] || '',
        di: item['数据标识'] || '',
        data: item['编程数据'] || '',
      })
    }
    return tableData
  },
  padLeftStr(str, SumLen, char) {
    var len = str.toString().length;
    while (len < SumLen) {
      str = char + str;
      len++;
    }
    return str;
  },
  padRightStr(str, SumLen, char) {
    var len = str.toString().length;
    while (len < SumLen) {
      str = str + char;
      len++;
    }
    return str;
  },
  intToBin(num, len) {
    let result = num.toString(2)
    return this.padLeftStr(result, len, '0').toUpperCase()
  },
  binToInt(str) {
    return parseInt(str, 2)
  },
  intToHex(num, len) {
    let result = num.toString(16)
    return this.padLeftStr(result, len, '0').toUpperCase()
  },
  hexToInt(str) {
    return parseInt(str, 16)
  },
  // ASCII码转16进制
  asciiStrToHexStr(str) {
    let result = ''
    for (let i = 0; i < str.length; i++) {
      result += this.intToHex(str.charCodeAt(i), 2)
    }
    return result
  },
  // 十六进制转ASCII码
  hexStrToAsciiStr(str) {
    let result = ''
    for (let i = 0; i < str.length / 2; i++) {
      let CharCode = parseInt(str.substr(i * 2, 2), 16);
      let item = String.fromCharCode(CharCode);
      result += item
    }
    return result
  },
  action33(str, action) {
    let result = ''
    let item
    for (let i = 0; i < str.length / 2; i++) {
      if (action === 'add')
        item = this.hexToInt(str.substr(i * 2, 2)) + this.hexToInt('33')
      else if (action === 'less')
        item = this.hexToInt(str.substr(i * 2, 2)) - this.hexToInt('33')
      result += this.intToHex(item, 2)
    }
    return result
  },
  reverseStr(str) {
    let result = ''
    for (let i = 0; i < str.length / 2; i++) {
      let item = str.substr(i * 2, 2)
      result = item + result
    }
    return result
  },
  getCheck(str) {
    let sum = 0
    for (let i = 0; i < str.length / 2; i++) {
      let item = this.hexToInt(str.substr(i * 2, 2))
      sum += item
    }
    let result = this.intToHex(sum, 2)
    if (result.length > 2) {
      return result.slice(-2)
    } else
      return this.padLeftStr(result, 2, '0').toUpperCase()
  }

}