# react-native-mixpush

集成了小米推送和极光推送，可以任意选择或者匹配规则，默认规则是小米手机采用小米推送，其他一律使用极光推送

## 使用
安装
```
yarn add react-native-mixpush --save
```
关联
```
react-native link
```
修改app 的 build.gradle 文件,替换对应你通知的配置
```
manifestPlaceholders = [
                JPUSH_APPKEY: "913c24e53c0d7ede41e828ae",   //替换你的极光APPKey
                APP_CHANNEL: "developer-default",        //应用渠道号
                MI_APPID: "2882303761517599402", //替换你的小米APPID
                MI_APPKEY: "5351759930402" //替换你的小米APPKey
        ]
```
运行工程，即可进行你的推送
