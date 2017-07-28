# react-native-mixpush

ios: 默认提供极光推送，在[apns分支](https://github.com/yinshuxun/react-native-mixpush.git#apns)分支上可通过自己搭建apns服务，可以直接走原生推送

android: 集成了小米推送和极光推送，可以任意选择或者匹配规则，默认规则 是小米手机采用小米推送，其他一律使用极光推送


####    注: 极光推送参考[jpush-react-native](https://github.com/jpush/jpush-react-native)    


## 使用
### 1、安装 (想使用苹果官方的apns推送，请看 [apns分支](https://github.com/yinshuxun/react-native-mixpush.git#apns) )
```
npm install react-native-mixpush --save
```
### 2、关联
```
react-native link
```
### 3、运行自动化配置脚本
```
npm run configureMixPush <极光推送appkey> <小米推送appid> <小米推送appkey> <安卓中需要，安卓的模块名字，默认可以不填写，为app>
举个例子：
npm run configureMixPush 913c24e53c0d7ede41e828ae 2882303761517599402 5351759930402
```
### 4、ios开启通知，需要手动操作2个步骤（注：通知只能在真机调试下有效果）
- 在 iOS 工程中设置 TARGETS-> BUILD Phases -> LinkBinary with Libraries 找到 UserNotifications.framework 把 status 设为 optional

- 在 xcode8 之后需要点开推送选项： TARGETS -> Capabilities -> Push Notification 设为 on 状态

配置完成。

-
### 配置检查（如果已经成功通过对应后台服务推送成功，那么下面的可以忽略）

#### ios

1、 在 iOS 工程中如果找不到头文件可能要在 TARGETS-> BUILD SETTINGS -> Search Paths -> Header Search Paths 添加如下路径
```
$(SRCROOT)/../node_modules/jpush-react-native/ios/RCTJPushModule/RCTJPushModule
```

#### Android 

1、 app的build.gradle下是否自动加上你的推送sdk配置

```
defaultConfig {
	......
    //下面是添加的配置部分
    manifestPlaceholders = [
                MI_APPID: "2882303761517599402", //替换你的小米APPID
                MI_APPKEY: "5351759930402" //替换你的小米APPKey
                JPUSH_APPKEY: "913c24e53c0d7ede41e828ae",   //替换你的极光APPKey
                APP_CHANNEL: "developer-default",        //应用渠道号
                
        ]
    ....
}
```
