import { Message } from 'element-ui'
import utils from './index';

export const importFile = (file) => {
  const fileSuffix = file.name.substring(file.name.lastIndexOf(".") + 1);
  const whiteList = ["xls", "xlsx"];
  if (whiteList.indexOf(fileSuffix) === -1) {
    Message({
      message: "只能选择EXCEL文件！",
      type: "error",
    });
    return;
  }

  const data = utils.readExcelData(file.path);
  Message({
    message: "导入数据成功！",
    type: "success",
  });
  return utils.formatExcelData(data);
}