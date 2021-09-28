<template>
  <div>
    <el-row>
      <el-col :span="12">
        <el-button type="primary" size="mini" @click="setParams()" plain>参数设置</el-button>
        <el-upload
          class="upload"
          accept=".xlsx, .xls"
          action="https://jsonplaceholder.typicode.com/posts/"
          :show-file-list="false"
          :before-upload="handleChange"
        >
          <el-button type="primary" size="mini" plain>导入方案</el-button>
        </el-upload>
        <el-button type="primary" size="mini" @click="download()" plain>模板下载</el-button>
      </el-col>
      <el-col :span="12" :offset="0" class="action-style">
        <el-button type="primary" size="mini" @click="start()" plain>开始</el-button>
        <el-button type="primary" size="mini" @click="end()" plain>停止</el-button>

        <el-button type="primary" size="mini" @click="clear()" plain>清空</el-button>
      </el-col>
    </el-row>
    <el-divider></el-divider>

    <el-row>
      <el-col :span="12" :offset="0">
        <el-table
          :data="tableData"
          border
          stripe
          fit
          height="calc(100vh - 62px)"
          ref="multipleTable"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="40"></el-table-column>
          <el-table-column prop="name" label="命令名称" width="120"></el-table-column>
          <el-table-column prop="rwType" label="抄编标志" width="80"></el-table-column>
          <el-table-column prop="di" label="数据标识" width="102">
            <template slot-scope="scope">
              <el-tag>{{scope.row.di}}</el-tag>
            </template>
          </el-table-column>

          <el-table-column prop="data" label="数据"></el-table-column>
        </el-table>
      </el-col>
      <el-col :span="12" :offset="0">
        <el-table
          :data="tableReceiveData"
          :row-class-name="tableRowClassName"
          height="calc(100vh - 62px)"
          style="width: 100%"
        >
          <el-table-column :show-overflow-tooltip="true" type="expand">
            <template slot-scope="props">
              <el-row :gutter="20" class="detail-row-style">
                <el-col :span="4" :offset="0">
                  <span class="label-style">表号</span>
                </el-col>
                <el-col :span="8" :offset="0">
                  <el-tag type="success" size="mini" class="content-style">
                    <span>{{ props.row.meterAddr }}</span>
                  </el-tag>
                </el-col>
                <el-col :span="4" :offset="0">
                  <span class="label-style">数据标识</span>
                </el-col>
                <el-col :span="8" :offset="0" class="content-style">
                  <span>
                    <el-tag size="mini">{{ props.row.di }}</el-tag>
                  </span>
                </el-col>
              </el-row>
              <el-row :gutter="20" class="detail-row-style">
                <el-col :span="4" :offset="0">
                  <span class="label-style">数据长度</span>
                </el-col>
                <el-col :span="8" :offset="0" class="content-style">
                  <span>{{ props.row.dataLen }}</span>
                </el-col>
                <el-col :span="4" :offset="0">
                  <span class="label-style">控制码</span>
                </el-col>
                <el-col :span="8" :offset="0" class="content-style">
                  <span>{{ props.row.controlCode }}</span>
                </el-col>
              </el-row>
              <el-row :gutter="20" class="detail-row-style">
                <el-col :span="4" :offset="0">
                  <span class="label-style">数据域</span>
                </el-col>
                <el-col :span="8" :offset="0" class="content-style">
                  <span>{{ props.row.dataArea}}</span>
                </el-col>
                <el-col :span="4" :offset="0">
                  <span class="label-style">校验</span>
                </el-col>
                <el-col :span="8" :offset="0" class="content-style">
                  <span>{{ props.row.cs }}</span>
                </el-col>
              </el-row>
              <el-row :gutter="20" class="detail-row-style">
                <el-col :span="4" :offset="0">
                  <span class="label-style">原始数据</span>
                </el-col>
                <el-col :span="20" :offset="0" class="content-style">
                  <span>{{ props.row.receiveFrame }}</span>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column label="表号" width="120" prop="meterAddr"></el-table-column>
          <el-table-column label="命令名称" prop="cmdName"></el-table-column>
          <el-table-column label="结果" width="80" prop="result"></el-table-column>
          <el-table-column label="时间" width="160" prop="date"></el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <el-drawer
      title="参数设置"
      :visible.sync="drawer"
      :direction="direction"
      :before-close="handleClose"
    >
      <div>
        <el-row>
          <el-col :span="23" :offset="1" class="head-title">
            <span>串口参数</span>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="20" :offset="2">
            <el-form :model="sp">
              <el-form-item label="串口" :label-width="formLabelWidth">
                <el-select v-model="sp.spName" placeholder="请选择串口">
                  <el-option
                    v-for="(com, index) in comList"
                    :label="com.path"
                    :value="com.path"
                    :key="index"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="波特率" :label-width="formLabelWidth">
                <el-select v-model="sp.baudRate" placeholder="请选择波特率">
                  <el-option
                    v-for="(baudRate, index) in baudRateList"
                    :label="baudRate"
                    :value="baudRate"
                    :key="index"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="校验位" :label-width="formLabelWidth">
                <el-select v-model="sp.parity" placeholder="请选择校验位">
                  <el-option
                    v-for="(parity, index) in parityList"
                    :label="parity.val"
                    :value="parity.key"
                    :key="index"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="23" :offset="1" class="head-title">
            <span>协议参数</span>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="20" :offset="2">
            <el-form :model="protocol">
              <el-form-item label="表号" :label-width="formLabelWidth">
                <el-input
                  v-model="protocol.meterAddr"
                  placeholder
                  size="normal"
                  clearable
                  maxlength="12"
                  show-word-limit
                ></el-input>
              </el-form-item>
              <el-form-item label="密级" :label-width="formLabelWidth">
                <el-input
                  v-model="protocol.pwd1"
                  placeholder
                  size="normal"
                  clearable
                  maxlength="2"
                  show-word-limit
                ></el-input>
              </el-form-item>
              <el-form-item label="密码" :label-width="formLabelWidth">
                <el-input
                  v-model="protocol.pwd2"
                  placeholder
                  size="normal"
                  clearable
                  maxlength="6"
                  show-word-limit
                ></el-input>
              </el-form-item>
              <el-form-item label="操作者" :label-width="formLabelWidth">
                <el-input
                  v-model="protocol.oper"
                  placeholder
                  size="normal"
                  clearable
                  maxlength="8"
                  show-word-limit
                ></el-input>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </div>
    </el-drawer>
  </div>
</template>
<script>
import serialport from "../../utils/serialport";
import { importFile } from "../../utils/importFile";
import {
  set645Frame,
  analysis645Frame,
  specialData,
} from "../../utils/dlt645";

export default {
  name: "main-page",
  data() {
    return {
      tableData: [],
      sendFrame: "",
      receiveFrame: "",
      tableReceiveData: [],
      cmdIndex: 0,
      drawer: false,
      protocol: {
        meterAddr: "AAAAAAAAAAAA",
        pwd1: "03",
        pwd2: "330000",
        oper: "12345678",
      },
      direction: "ltr",
      sp: {
        spName: "COM1",
        baudRate: "2400",
        parity: "even",
      },
      spObj: {},
      comList: [],
      baudRateList: ["1200", "2400", "4800", "9600", "115200"],
      parityList: [
        { key: "odd", val: "奇校验" },
        { key: "even", val: "偶校验" },
        { key: "none", val: "无校验" },
      ],
      formLabelWidth: "60px",
      selectedData: [],
      continueFlag: true,
    };
  },
  created() {
    serialport.getComList().then((ports) => {
      this.comList = ports.reverse();
    });
    this.spObj = null;
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      if (row.result === "成功") {
        return "success-row";
      } else {
        return "warning-row";
      }
    },
    download() {
      if (process.env.NODE_ENV !== "development") {
        window.location.href =
          process.cwd() + "\\resources\\extraResources\\template.xlsx";
      } else {
        window.location.href = "extraResources\\template.xlsx";
      }
    },
    handleChange(file) {
      this.tableData = importFile(file);
    },
    handleSelectionChange(val) {
      this.selectedData = val;
    },
    setParams() {
      this.drawer = true;
    },
    handleClose(done) {
      done();
    },
    start() {
      this.cmdIndex = 0;
      this.continueFlag = true;
      this.tableReceiveData = [];
      // 初始化
      let openOptions = {
        baudRate: parseInt(this.sp.baudRate),
        parity: this.sp.parity,
      };
      if (this.spObj === null) {
        this.spObj = serialport.initSP(this.sp.spName, openOptions);
      }

      let cmdName = "";
      let rwType = "";
      const item = this.selectedData[this.cmdIndex];
      cmdName = item.name;
      rwType = item.rwType;
      const di = item.di;
      let data = item.data;

      data = specialData(data);
      const meterAddr = this.protocol.meterAddr;
      const pass1 = this.protocol.pwd1;
      const pass2 = this.protocol.pwd2;
      const oper = this.protocol.oper;

      let sendFrame = set645Frame(
        cmdName,
        meterAddr,
        rwType,
        di,
        pass1,
        pass2,
        oper,
        data
      );
      // 打开串口
      serialport.openSP();
      // 发送命令
      serialport.sendData(sendFrame);

      let _this = this;
      // 接收命令
      serialport.receiveData((result) => {
        _this.cmdIndex++;
        _this.receiveFrame = result;
        if (_this.receiveFrame && _this.receiveFrame.length > 0) {
          let o = analysis645Frame(cmdName, _this.receiveFrame, rwType);
          _this.tableReceiveData.unshift(o);
          if (o.result === "成功") {
            if (cmdName === "读取表号") {
              _this.protocol.meterAddr = o.meterAddr;
            }
          } else {
            _this.$message({
              message: _this.receiveFrame,
              type: "error",
            });
          }
          // 关闭串口
          // serialport.closeSP();
        }

        if (_this.cmdIndex < _this.selectedData.length) {
          const item = _this.selectedData[_this.cmdIndex];
          cmdName = item.name;
          rwType = item.rwType;
          const di = item.di;
          let data = item.data;

          data = specialData(data);
          const meterAddr = _this.protocol.meterAddr;
          const pass1 = _this.protocol.pwd1;
          const pass2 = _this.protocol.pwd2;
          const oper = _this.protocol.oper;

          let sendFrame = set645Frame(
            cmdName,
            meterAddr,
            rwType,
            di,
            pass1,
            pass2,
            oper,
            data
          );
          // 打开串口
          // serialport.openSP();
          // 发送命令
          serialport.sendData(sendFrame);
        } else {
          // 关闭串口
          serialport.closeSP();
          this.spObj = null;
        }
      });
    },
    end() {
      this.continueFlag = false;
      // 关闭串口
      serialport.closeSP();
      this.spObj = null;
    },
    clear() {
      this.tableReceiveData = [];
    },
  },
};
</script>
<style scoped>
.upload {
  display: inline-block;
}
.el-divider {
  margin: 8px 0;
}
.head-title {
  padding-bottom: 20px;
  font-weight: bold;
  color: cornflowerblue;
}
.label-style {
  float: right;
  padding-left: 12px;
  color: #99a9bf;
}
.detail-row-style {
  margin-bottom: 16px;
}

.el-table /deep/ .warning-row {
  background: rgb(246, 232, 206);
}

.el-table /deep/ .success-row {
  background: #dcf1d1;
}

.el-table /deep/ .content-style {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.action-style {
  text-align: right;
}
</style>