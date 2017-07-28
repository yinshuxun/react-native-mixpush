"use strict";

const apn = require("apn");

// token 数组
let tokens = ["2020b11a82b293d5c8c6dba817cb72b9eff0ecc3063417c8f11733037079625a"];

let service = new apn.Provider({
    cert: "/Users/shuxun/Desktop/apns-dev/apns-dev-cert.pem",//替换自己的cert pem证书
    key: "/Users/shuxun/Desktop/apns-dev/apns-dev-key.pem",//替换自己的key pem证书
    gateway: "gateway.sandbox.push.apple.com",
    // gateway: "gateway.push.apple.com"; //线上地址
    // port: 2195, //端口
    passphrase: "96998" //替换自己的pem证书密码
});

let note = new apn.Notification({
    alert: "这是一个新的通知"
});

// 替换 主题 一般取应用标识符（bundle identifier）
note.topic = "org.reactjs.native.example.MICRNDemo"

console.log(`Sending: ${note.compile()} to ${tokens}`);
service.send(note, tokens).then(result => {
    console.log("sent:", result.sent.length);
    console.log("failed:", result.failed.length);
    console.log(result.failed);
});

service.shutdown();
