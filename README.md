# 微吼云播放器JS-SDK & Demo
------

## 启动Demo

1. 在终端输入命令

   ```bash
   npx http-server
   ```

2. 打开浏览器，输入网址（ http://127.0.0.1:8080/ ），进入后点击相应版本，点击 player_new.html 进入体验微吼播放器Demo。

## 代码结构
/src
├── Config.js -- 环境变量，业务域名控制
├── H5component -- H5 控件皮肤类 集合
├── VhallInterface.js
├── common
│   ├── Constant.js
│   ├── Store.js
│   ├── UIComponent.js
│   ├── Utils.js
│   └── lang
│       ├── en.json
│       ├── index.js
│       └── zh-CN.json
├── component -- PC 空间皮肤类集合
├── index.js
└── message
    ├── Api.js  -- API 接口相关请求
    └── Http.js  -- 网络请求封装

## 播放器 内核 代码结构
./h5_player/src
├── ErrorCode.js  - 错误码 常量定义
├── PlayerEvents.js - 播放器 事件常量定义
├── PlayerProxy.js - 播放器 功能抽象层
├── VideoModule.js - 流媒体，播放器内核入口文件。 负责初始化播放器， 加载插件。
├── api
│   ├── CommonAPI.js
│   └── PlayerAPI.js - 播放器API 后期，混入用
├── config.js
├── core
│   ├── Component.js - 组件基类 - 所有组件的基础。包括插件。
│   ├── Constant.js - 常量定义
│   ├── Plugin.js - 插件基类
│   └── Store.js - 存取器 ，对对象的封装。
├── index.js - 打包 入口。
├── player
│   ├── AbstractPlayer.js - 抽象播放器 继承自 playerProxy
│   ├── createPlayer.js - 播放器创建工厂方法
│   ├── flash -- 降级用的Flash 播放器
│   │   ├── FlashPlayer.js
│   │   └── flash.js
│   ├── flv - B 站开源的播放器
│   │   ├── FlvPlayer.js
│   ├── hls - hls 开源库
│   │   ├── HlsPlayer.js
│   └── native - 不支持MSE 时的降级方案
│       ├── NativePlayer.js
├── plugins -- 插件功能集合
│   ├── Capture.js
│   ├── Danmaku.js
│   ├── Debugger.js
│   ├── Fullscreen.js
│   ├── I18n.js
│   ├── Keyboard.js
│   ├── Lag.js
│   ├── LiveTimeshift.js
│   ├── Marquee.js
│   ├── PlayCurrentTime.js
│   ├── PlaybackRate.js
│   ├── PluginMap.js
│   ├── Pursue.js
│   ├── Reporter.js
│   ├── Scheduler.js
│   ├── Subtitle.js
│   ├── Switcher.js
│   ├── Watermark.js
│   ├── lag
│   │   └── TencentInject.js
│   ├── poster.js
│   ├── report
│   │   ├── AbstractReporter.js
│   │   ├── Http.js
│   │   ├── LiveReporter.js
│   │   └── VodReporter.js
│   ├── scheduler
│   │   ├── AbstractScheduler.js
│   │   ├── LiveScheduler.js
│   │   ├── Token.js
│   │   └── VodScheduler.js
│   ├── thorn
│   │   └── Chain.js
│   └── thorn.js
└── utils -- 工具类
    ├── Dom.js
    ├── Log.js
    ├── UUID.js
    └── util.js


   ## 发现的一些问题

   - PAAS 层，承担的功能性 太低。

      当前所做内容。

      1. paas 账号信息校验。

      2. SDK 接口调用前置，校验和错误处理机制

      3. 功能UI 层的处理。

      建议：

      将结构图中的，表现性功能前置到paas层去处理。降低内核的开发和部署频率。

   - 公用库，太多。 比较随意。 ajax 请求有， xmlHttpReques , axios 。 多种引用的问题。

      精简代码结构，复用通用网络请求。

   - lag 多语言功能显得很鸡肋。

   - demo 功能组合化 测试不方便。

      建议：

      参考百度地图的体验DEMO。 能实时修改和预览。


   ## 个人遇到的问题

   - h264 解码。 还是解不了。

      带来的收益：

      后期，更好video的视频渲染层，可换为 webgl 或者 canvas 。

      替换掉 hls、 flv. 灵活性和整体sdk 体积会更好。
