# react-native-mixpush

集成了小米推送和极光推送，可以任意选择或者匹配规则，默认规则是小米手机采用小米推送，其他一律使用极光推送

####    ios部分集成了[jpush-react-native](https://github.com/jpush/jpush-react-native)       和 [jcore-react-native](https://github.com/jpush/jcore-react-native)


## 使用
### 安装
```
yarn add react-native-mixpush --save
```
###1、自动配置(以下命令均在你的 React Native Project 目录下运行，自动配置后仍需手动配置一部分)

- 执行脚本
```
npm run configureJPush <yourModuleName> <yourAppKey> <yourmiId> <yourmiKey>
//module name 指的是你 Android 项目中的模块名字

//举个例子:
npm run configureJPush micrndemo 913c24e53c0d7ede41e828ae 2882303761517599402 5351759930402
```

- Link 项目
```
//执行自动配置脚本后再执行 link 操作
react-native link
```


### 2.手动操作部分(自动配置后，部分操作需要手动修改) 
#### iOS 手动操作部分 （3个步骤）
- 在 iOS 工程中设置 TARGETS-> BUILD Phases -> LinkBinary with Libraries 找到 UserNotifications.framework 把 status 设为 optional

- 在 iOS 工程中如果找不到头文件可能要在 TARGETS-> BUILD SETTINGS -> Search Paths -> Header Search Paths 添加如下路径
```
$(SRCROOT)/../node_modules/jpush-react-native/ios/RCTJPushModule/RCTJPushModule
```
- 在 xcode8 之后需要点开推送选项： TARGETS -> Capabilities -> Push Notification 设为 on 状态

#### Android 手动操作部分 （如果正确操作，应该不需要手动操作）
以下为检查项：

如果没有替换成，需要自己手动去app的build.gradle下加上你的
```
defaultConfig {
    //下面是添加部分
    manifestPlaceholders = [
                MI_APPID: "2882303761517599402", //替换你的小米APPID
                MI_APPKEY: "5351759930402" //替换你的小米APPKey
                JPUSH_APPKEY: "913c24e53c0d7ede41e828ae",   //替换你的极光APPKey
                APP_CHANNEL: "developer-default",        //应用渠道号
                
        ]
}
```
