# dlt645-2007-tool

> 一个简易的DLT645-2007协议通讯工具


### 说明

> 基于 [Electron](https://github.com/electron/electron) + [Vue](https://github.com/vuejs/vue)([electron-vue](https://github.com/SimulatedGREG/electron-vue)) + [element-ui](https://github.com/ElemeFE/element) + [serialport](https://github.com/serialport/node-serialport) 在Windows平台开发的DLT645-2007协议通讯工具

所用技术栈：

- [Electron](https://github.com/electron/electron) 12.1.1
- [Vue](https://github.com/vuejs/vue) 2.6.14
- [electron-vue](https://github.com/SimulatedGREG/electron-vue)
- [element-ui](https://github.com/ElemeFE/element) 2.15.6
- [serialport](https://github.com/serialport/node-serialport) 9.2.1


### Windows10下环境搭建
- node: 14.17.5
- npm: 6.14.14
- npm config set registry https://registry.npm.taobao.org/
- npm config set ELECTRON_MIRROR http://npm.taobao.org/mirrors/electron/
- Python: 3.x
- 安装[Visual Studio 2017 15.7.2 或更高版本](https://visualstudio.microsoft.com/zh-hans/vs/) 或安装[ Visual Studio Build Tools](https://visualstudio.microsoft.com/thank-you-downloading-visual-studio/?sku=BuildTools)

	并执行 npm config set msvs_version 2017
- 为 Electron 安装并重新编译Node原生模块: npm install --save-dev electron-rebuild 

- npm install -g node-gyp

- 若执行npm install后, node-gyp报错， 提示 "Visual Studio C++ core features" missing 

	则安装 build工具：执行 npm i -g windows-build-tools
	
	此过程若卡在"Still waiting for installer log file...",则去下载目录C:\Users\Administrator\.windows-build-tools,
	
	手动运行vs_BuildTools.exe，单个组件->勾选Node.js MSBuild支持，下载安装
	
	![界面截图](./imgs/buildTool.png)
	
	![界面截图](./imgs/VSInstaller.png)
	
	![界面截图](./imgs/MSBuild.png)
	
	若仍然报错，则再手动打开vs_BuildTools.exe，安装入下图所示的两个。应该就可以了。
	
	![界面截图](./imgs/ENV.png)
	
- npm install安装成功后，若windows下构建时提示失败，可尝试执行 .\node_modules\\.bin\electron-rebuild.cmd
### 构建

```

# 安装依赖
npm install

# 开发环境
npm run dev

# 生产环境
npm run build

```

### 界面

## 界面一

<div align="center">
	<img src="./imgs/main.jpg" alt="界面一" align=center />
</div>

## 界面二

<div align="center">
	<img src="./imgs/params.jpg" alt="界面二" align=center />
</div>