//   这个地方是更新配置文件 的脚本
var fs = require('fs');
var spath = require('path');
var os = require('os');

// add other link flag

const proArgvs = process.env.npm_package_scripts_configureMixPush.replace(/\"/g, "").split(" ").splice(2);

var moduleName = proArgvs[3];
if (moduleName == undefined || moduleName == null) {
    console.log("没有输入 moduleName, 将使用默认模块名： app");
    moduleName = "app";
};

var appKey = proArgvs[0];
if (appKey == undefined || appKey == null) {
    console.log("error 没有输入 appKey 参数");
    return;
}

var miId = proArgvs[1];
if (miId == undefined || miId == null) {
    console.log("error 没有输入 miId 参数");
    return;
}

var miKey = proArgvs[2];
if (miKey == undefined || miKey == null) {
    console.log("error 没有输入 miKey 参数");
    return;
}


function insertJpushCode(path) {
    // 	 这个是插入代码的脚本 install
    if (isFile(path) == false) {
        console.log("configuration JPush error!!");
        return;
    }

    var rf = fs.readFileSync(path, "utf-8");
    // 删除所有的 JPush 相关代码  注册推送的没有删除，
    rf = rf.replace(/\n\#import \<RCTJPushModule.h\>/, "");
    rf = rf.replace(/\n\#ifdef NSFoundationVersionNumber_iOS_9_x_Max/, "");
    rf = rf.replace(/\n\#import \<UserNotifications\/UserNotifications\.h\>/, "");
    rf = rf.replace(/\n\#import \<UserNotifications\/UserNotifications\.h\>/, "");
    rf = rf.replace(/\n\#endif/, "");
    rf = rf.replace(/\[JPUSHService registerDeviceToken:deviceToken\]\;\n/, "");

    // 插入 头文件
    rf = rf.replace(/#import "AppDelegate.h"/, "\#import \"AppDelegate.h\"\n\#import \<RCTJPushModule.h\>\n\#ifdef NSFoundationVersionNumber_iOS_9_x_Max\n\#import \<UserNotifications\/UserNotifications\.h\>\n\#endif");
    fs.writeFileSync(path, rf, "utf-8");


    // 这个是删除代码的脚本 uninstall
    // var rf = fs.readFileSync(path,"utf-8");
    // rf = rf.replace(/#import "AppDelegate.h"[*\n]#import <RCTJPushModule.h>/,"\#import \"AppDelegate.h\"");
    // fs.writeFileSync(path, rf, "utf-8");

    // 插入 注册推送 和启动jpush sdk
    // - (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
    // {
    var rf = fs.readFileSync(path, "utf-8");
    var searchDidlaunch = rf.match(/\n.*didFinishLaunchingWithOptions.*\n?\{/);
    if (searchDidlaunch == null) {
        console.log("没有匹配到 didFinishLaunchingWithOptions");
        console.log(rf);
    } else {
        // console.log(searchDidlaunch[0]);
        var oldValue = rf.match(/\[JPUSHService registerForRemoteNotificationTypes/)
        if (oldValue == null) {
            rf = rf.replace(searchDidlaunch[0], searchDidlaunch[0] + "\n    if \(\[\[UIDevice currentDevice\]\.systemVersion floatValue\] >= 10.0\) \{\n \#ifdef NSFoundationVersionNumber_iOS_9_x_Max\n    JPUSHRegisterEntity \* entity \= \[\[JPUSHRegisterEntity alloc\] init\]\;\n     entity\.types \= UNAuthorizationOptionAlert\|UNAuthorizationOptionBadge\|UNAuthorizationOptionSound\;\n     \[JPUSHService registerForRemoteNotificationConfig\:entity delegate\:self\]\;\n \n\#endif\n\} else if \(\[\[UIDevice currentDevice\]\.systemVersion floatValue\] \>\= 8\.0\) \{\n\
    \[JPUSHService registerForRemoteNotificationTypes\:\(UIUserNotificationTypeBadge \|\n\
                                                      UIUserNotificationTypeSound \|\n\
                                                      UIUserNotificationTypeAlert\)\n\
                                          categories\:nil\]\;\n\
  \} else \{\n\
    \[JPUSHService registerForRemoteNotificationTypes\:\(UIRemoteNotificationTypeBadge \|\n\
                                                      UIRemoteNotificationTypeSound \|\n\
                                                      UIRemoteNotificationTypeAlert)\n\
                                          categories\:nil\]\;\n\
  }\n\
  \n\
  \[JPUSHService setupWithOption\:launchOptions appKey\:\@\"" + appKey + "\"\n\
                        channel\:nil apsForProduction\:nil\]\;");
            fs.writeFileSync(path, rf, "utf-8");
        }

    }


    //  这个插入代码 didRegisterForRemoteNotificationsWithDeviceToken
    var rf = fs.readFileSync(path, "utf-8");
    var search = rf.match(/\n.*didRegisterForRemoteNotificationsWithDeviceToken\:\(NSData \*\)deviceToken[ ]*\{/);

    if (search == null) {
        console.log("没有匹配到 函数 didRegisterForRemoteNotificationsWithDeviceToken");
        rf = rf.replace(/\@end/, "\- \(void\)application\:\(UIApplication \*\)application\ didRegisterForRemoteNotificationsWithDeviceToken\:\(NSData \*\)deviceToken \{\n\[JPUSHService registerDeviceToken:deviceToken\]\;\n\}\n\@end");
        // console.log(rf);
        fs.writeFileSync(path, rf, "utf-8");
    } else {
        console.log(search[0]);
        var oldValue = rf.match(/\[JPUSHService registerDeviceToken/)
        if (oldValue == null) {
            rf = rf.replace(search[0], search[0] + "\n\[JPUSHService registerDeviceToken:deviceToken\]\;");
            fs.writeFileSync(path, rf, "utf-8");
        } else {
            console.log("registerDeviceToken存在，不在插入");
        }

    }

    // 这里插入 didReceiveRemoteNotification
    var rf = fs.readFileSync(path, "utf-8");
    var search = rf.match(/\n.*didReceiveRemoteNotification\:\(NSDictionary \*\)userInfo[ ]*\{/);
    if (search == null) {
        console.log("没有匹配到 函数 didReceiveRemoteNotification");
        rf = rf.replace(/\@end/, "\- \(void\)application\:\(UIApplication \*\)application\ didReceiveRemoteNotification\:\(NSDictionary \*\)userInfo \{\n\[\[NSNotificationCenter\ defaultCenter\]\ postNotificationName\:kJPFDidReceiveRemoteNotification\ object\:userInfo\]\;\n\}\n\@end");
        // console.log(rf);
        fs.writeFileSync(path, rf, "utf-8");
    }

    // 这里插入 didReceiveRemoteNotification fetchCompletionHandler
    var rf = fs.readFileSync(path, "utf-8");
    var search = rf.match(/\n.*didReceiveRemoteNotification\:[ ]*\(NSDictionary \*\)[ ]*userInfo[ ]*fetchCompletionHandler\:\(void[ ]*\(\^\)[ ]*\(UIBackgroundFetchResult\)\)completionHandler \{/);
    if (search == null) {
        console.log("没有匹配到 函数 didReceiveRemoteNotification fetchCompletionHandler");
        rf = rf.replace(/\@end/, "\- \(void\)application\:\(UIApplication \*\)application\ didReceiveRemoteNotification\:\(NSDictionary \*\)userInfo fetchCompletionHandler\:\(void\ \(\^\)   \(UIBackgroundFetchResult\)\)completionHandler\ \{\n\[\[NSNotificationCenter\ defaultCenter\]\ postNotificationName\:kJPFDidReceiveRemoteNotification\ object\:userInfo\]\;\n\}\n\@end");
        // console.log(rf);
        fs.writeFileSync(path, rf, "utf-8");
    }

    // 这里插入 willPresentNotification
    var rf = fs.readFileSync(path, "utf-8");
    var search = rf.match(/\n.*willPresentNotification\:\(UNNotification \*\)notification[ ]*withCompletionHandler\:.*\{\n/);
    if (search == null) {
        console.log("没有匹配到 函数 willPresentNotification");
        rf = rf.replace(/\@end/, "\- \(void\)jpushNotificationCenter\:\(UNUserNotificationCenter\ \*\)center willPresentNotification\:\(UNNotification\ \*\)notification\ withCompletionHandler\:\(void\ \(\^\)\(NSInteger\)\)completionHandler\ \{\n NSDictionary\ \* userInfo\ \=\ notification\.request\.content\.userInfo\;\n if\(\[notification\.request\.trigger\ isKindOfClass\:\[UNPushNotificationTrigger\ class\]\]\)\ \{\n \[JPUSHService\ handleRemoteNotification\:userInfo\]\;\n \[\[NSNotificationCenter\ defaultCenter\]\ postNotificationName\:kJPFDidReceiveRemoteNotification\ object\:userInfo\]\;\n \ \ \ \}\n completionHandler\(UNNotificationPresentationOptionAlert\)\;\n\}\n\@end");
        // console.log(rf);
        fs.writeFileSync(path, rf, "utf-8");
    }

    // 这里插入 didReceiveNotificationResponse
    var rf = fs.readFileSync(path, "utf-8");
    var search = rf.match(/\n.*jpushNotificationCenter\:\(UNUserNotificationCenter \*\)center[ ]*didReceiveNotificationResponse\:\(UNNotificationResponse\ \*\)response.*\{\n/);
    if (search == null) {
        console.log("没有匹配到 函数 didReceiveRemoteNotification");
        rf = rf.replace(/\@end/, "\- \(void\)jpushNotificationCenter\:\(UNUserNotificationCenter\ \*\)center\ didReceiveNotificationResponse\:\(UNNotificationResponse\ \*\)response\ withCompletionHandler\:\(void\ \(\^\)\(\)\)completionHandler\ \{\nNSDictionary\ \*\ userInfo\ \=\ response\.notification\.request\.content\.userInfo\;\nif\(\[response\.notification\.request\.trigger\ isKindOfClass\:\[UNPushNotificationTrigger\ class\]\]\)\ \{\n\[JPUSHService\ handleRemoteNotification\:userInfo\]\;\n\[\[NSNotificationCenter\ defaultCenter\]\ postNotificationName\:kJPFOpenNotification\ object:userInfo\]\;\n\}\ncompletionHandler\(\)\;\n\}\n\@end");
        // console.log(rf);
        fs.writeFileSync(path, rf, "utf-8");
    }
}

function insertRCTPushCode(path) {
    // 	 这个是插入代码的脚本 install
    if (isFile(path) == false) {
        console.log("configuration JPush error!!");
        return;
    }

    var rf = fs.readFileSync(path, "utf-8");
    // 删除所有的 RCTPushNotificationManager 相关代码  注册推送的没有删除，
    rf = rf.replace(/\n\#import \<RCTPushNotificationManager.h\>/, "");
    rf = rf.replace(/\n\#ifdef NSFoundationVersionNumber_iOS_9_x_Max/, "");
    rf = rf.replace(/\n\#import \<UserNotifications\/UserNotifications\.h\>/, "");
    rf = rf.replace(/\n\#endif/, "");

    // 插入 头文件
    rf = rf.replace(/#import "AppDelegate.h"/, "\#import \"AppDelegate.h\"\n\#import \<RCTPushNotificationManager.h\>\n\#ifdef NSFoundationVersionNumber_iOS_9_x_Max\n\#import \<UserNotifications\/UserNotifications\.h\>\n\#endif");
    fs.writeFileSync(path, rf, "utf-8");


    // 这个是删除代码的脚本 uninstall
    // var rf = fs.readFileSync(path,"utf-8");
    // rf = rf.replace(/#import "AppDelegate.h"[*\n]#import <RCTJPushModule.h>/,"\#import \"AppDelegate.h\"");
    // fs.writeFileSync(path, rf, "utf-8");

    // 插入 注册推送 和启动jpush sdk
    // - (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
    // {
    var rf = fs.readFileSync(path, "utf-8");
    var searchDidlaunch = rf.match(/\n.*didFinishLaunchingWithOptions.*\n?\{/);
    if (searchDidlaunch == null) {
        console.log("没有匹配到 didFinishLaunchingWithOptions");
        console.log(rf);
    } else {
        // console.log(searchDidlaunch[0]);
        var oldValue = rf.match(/registerForRemoteNotifications/)
        if (oldValue == null) {
           rf = rf.replace(searchDidlaunch[0], `${searchDidlaunch[0]}
           if ([[UIDevice currentDevice].systemVersion floatValue] >= 10.0) {
    //iOS10特有
    UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
    // 必须写代理，不然无法监听通知的接收与点击
    center.delegate = self;
    [center requestAuthorizationWithOptions:(UNAuthorizationOptionAlert | UNAuthorizationOptionBadge | UNAuthorizationOptionSound) completionHandler:^(BOOL granted, NSError * _Nullable error) {
      if (granted) {
        // 点击允许
        NSLog(@"注册成功");
        [center getNotificationSettingsWithCompletionHandler:^(UNNotificationSettings * _Nonnull settings) {
          NSLog(@"%@", settings);
        }];
      } else {
        // 点击不允许
        NSLog(@"注册失败");
      }
    }];
  }else if ([[UIDevice currentDevice].systemVersion floatValue] >8.0){
    //iOS8 - iOS10
    [application registerUserNotificationSettings:[UIUserNotificationSettings settingsForTypes:UIUserNotificationTypeAlert | UIUserNotificationTypeSound | UIUserNotificationTypeBadge categories:nil]];

  }else if ([[UIDevice currentDevice].systemVersion floatValue] < 8.0) {
    //iOS8系统以下
    [application registerForRemoteNotificationTypes:UIRemoteNotificationTypeBadge | UIRemoteNotificationTypeAlert | UIRemoteNotificationTypeSound];
  }
  // 注册获得device Token
  [[UIApplication sharedApplication] registerForRemoteNotifications];
           `)
            fs.writeFileSync(path, rf, "utf-8");
        }

    }


    //  这个插入代码 didRegisterForRemoteNotificationsWithDeviceToken
    var rf = fs.readFileSync(path, "utf-8");
    var search = rf.match(/\n.*didRegisterForRemoteNotificationsWithDeviceToken\:\(NSData \*\)deviceToken[ ]*\{/);

    if (search == null) {
        console.log("没有匹配到 函数 didRegisterForRemoteNotificationsWithDeviceToken");
        rf = rf.replace(/\@end/, `
        // Required for the register event.
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
{
    [RCTPushNotificationManager didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
    NSLog(@"注册devicetoken::%@",deviceToken);
}

@end`);
        // console.log(rf);
        fs.writeFileSync(path, rf, "utf-8");
    } else {
        console.log(search[0]);
        var oldValue = rf.match(/\[RCTPushNotificationManager didRegisterForRemoteNotificationsWithDeviceToken/)
        if (oldValue == null) {
            rf = rf.replace(search[0], search[0] + `
[RCTPushNotificationManager didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
NSLog(@"注册devicetoken成功::%@",deviceToken);
            `);
            fs.writeFileSync(path, rf, "utf-8");
        } else {
            console.log("registerDeviceToken存在，不在插入");
        }

    }

    // 这里插入 didRegisterUserNotificationSettings
    var rf = fs.readFileSync(path, "utf-8");
    var search = rf.match(/\n.*didRegisterUserNotificationSettings\:\(UIUserNotificationSettings \*\)notificationSettings/);
    if (search == null) {
        console.log("没有匹配到 函数 didRegisterUserNotificationSettings");
        rf = rf.replace(/\@end/, `
        // Required to register for notifications
- (void)application:(UIApplication *)application didRegisterUserNotificationSettings:(UIUserNotificationSettings *)notificationSettings
{
  [RCTPushNotificationManager didRegisterUserNotificationSettings:notificationSettings];
}

@end
        `);
        // console.log(rf);
        fs.writeFileSync(path, rf, "utf-8");
    }

    // 这里插入 didReceiveRemoteNotification
    var rf = fs.readFileSync(path, "utf-8");
    var search = rf.match(/\n.*didReceiveRemoteNotification\:\(NSDictionary \*\)notification/);
    if (search == null) {
        console.log("没有匹配到 函数 didReceiveRemoteNotification");
        rf = rf.replace(/\@end/, `
        // Required for the notification event.
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)notification
{
  [RCTPushNotificationManager didReceiveRemoteNotification:notification];
}

@end
        `);
        // console.log(rf);
        fs.writeFileSync(path, rf, "utf-8");
    }

    // 这里插入 didRegisterUserNotificationSettings
    var rf = fs.readFileSync(path, "utf-8");
    var search = rf.match(/\n.*didReceiveLocalNotification\:\(UILocalNotification \*\)notification/);
    if (search == null) {
        console.log("没有匹配到 函数 didReceiveLocalNotification");
        rf = rf.replace(/\@end/, `
 // Required for the localNotification event.
- (void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification
{
  [RCTPushNotificationManager didReceiveLocalNotification:notification];
}

@end
        `);
        // console.log(rf);
        fs.writeFileSync(path, rf, "utf-8");
    }
}


// 判断文件
function exists(path) {
    return fs.existsSync(path) || path.existsSync(path);
}

function isFile(path) {
    return exists(path) && fs.statSync(path).isFile();
}

function isDir(path) {
    return exists(path) && fs.statSync(path).isDirectory();
}


//  深度遍历所有文件，
getAllfiles("./ios", function (f, s) {
    var isAppdelegate = f.match(/AppDelegate\.m/);
    // 找到Appdelegate.m 文件 插入代码
    if (isAppdelegate != null) {
        console.log("the file is appdelegate:" + f);
        // insertJpushCode(f);
        insertRCTPushCode(f);
    }
});

// getAndroidManifest("./android/" + moduleName, function(f, s) {
// 	var isAndroidManifest = f.match(/AndroidManifest\.xml/);
// 	if (isAndroidManifest != null) {
// 		//mixpush pass
// 		// configureAndroidManifest(f);
// 	};
// });

getConfigureFiles("./android", function (f, s) {
    //找到settings.gradle
    var isSettingGradle = f.match(/settings\.gradle/);
    if (isSettingGradle != null) {
        //mixpush pass
        // console.log("find settings.gradle in android project " + f);
        // configureSetting(f);
    }

    //找到project下的build.gradle
    var isProjectGradle = f.match(/.*\/build\.gradle/);
    if (isProjectGradle != null) {
        console.log("find build.gradle in android project " + f);
        //mixpush pass
        // configureGradle(f);
        configureAppkey(f);
    }
});
// getAllfiles("./",function(f,s){
//   console.log(f);
//   var isAppdelegate = f.match(/AppDelegate\.m/);
//   var isiOSProjectPbxprojFile = f.match(/[.]*\.pbxproj/);
// });
// function to get all file
function getAllfiles(dir, findOne) {
    // if (arguments.length < 2) throw new TypeError('Bad arguments number');

    if (typeof findOne !== 'function') {
        throw new TypeError('The argument "findOne" must be a function');
    }

    eachFileSync(spath.resolve(dir), findOne);
}

function eachFileSync(dir, findOne) {
    var stats = fs.statSync(dir);
    findOne(dir, stats);

    // 遍历子目录
    if (stats.isDirectory()) {
        var files = fullPath(dir, fs.readdirSync(dir));
        // console.log(dir);
        files.forEach(function (f) {
            eachFileSync(f, findOne);
        });
    }
}

function fullPath(dir, files) {
    return files.map(function (f) {
        return spath.join(dir, f);
    });
}



// android
function getGradleFile(dir, findOne) {
    if (typeof findOne !== 'function') {
        throw new TypeError('The argument "findOne" must be a function');
    }

    eachFileSync(spath.resolve(dir), findOne);

}

function getAndroidManifest(dir, findOne) {
    if (typeof findOne !== 'function') {
        throw new TypeError('The argument "findOne" must be a function');
    }

    eachFileSync(spath.resolve(dir), findOne);
}

function getConfigureFiles(dir, findOne) {
    if (typeof findOne !== 'function') {
        throw new TypeError('The argument "findOne" must be a function');
    }

    eachFileSync(spath.resolve(dir), findOne);
}

function configureAndroidManifest(path) {
    if (isFile(path) == false) {
        console.log("configuration JPush error!!");
        return;
    }

    var rf = fs.readFileSync(path, "utf-8");
    var isAlreadyWrite = rf.match(/.*android\:value=\"\$\{JPUSH_APPKEY\}\"/);
    if (isAlreadyWrite == null) {
        var searchKey = rf.match(/\n.*\<\/activity\>/);
        if (searchKey != null) {
            rf = rf.replace(searchKey[0], searchKey[0] + "\n\n\<meta-data android\:name=\"JPUSH_CHANNEL\" android\:value=\"\$\{APP_CHANNEL\}\"\/\>\n\<meta-data android\:name=\"JPUSH_APPKEY\" android\:value=\"\$\{JPUSH_APPKEY\}\"\/\>\n");
            fs.writeFileSync(path, rf, "utf-8");
        }
    };
}

function configureAppkey(path) {
    if (isFile(path) == false) {
        console.log("configure AppKey error1!!");
        return;
    }

    var rf = fs.readFileSync(path, "utf-8");
    var isAlreadyWrite = rf.match(/.*JPUSH_APPKEY.*/);
    if (isAlreadyWrite == null) {
        var insertKey = rf.match(/\n.*ndk \{\n/);
        if (insertKey != null) {
            rf = rf.replace(insertKey[0], "\n       manifestPlaceholders = \[\n             MI_APPID\: \"" + miId + "\"\,\n             MI_APPKEY\: \"" + miKey + "\"\,\n           JPUSH_APPKEY\: \"" + appKey + "\"\,\n       APP_CHANNEL\: \"developer-default\"\n        \]\n" + insertKey[0]);
            fs.writeFileSync(path, rf, "utf-8");
        } else {
            console.log("Configure appKey error, should configure manually.");
        }
    }

}

function configureSetting(path) {
    if (isFile(path) == false) {
        console.log("configuration JPush error!!");
        return;
    }

    var rf = fs.readFileSync(path, "utf-8");
    var isAlreadyWrite = rf.match(/.*jpush-react-native.*/);
    if (isAlreadyWrite == null) {
        var re = new RegExp("\n.*include.*\'\:" + moduleName + "\'", "gi");
        var searchKey = rf.match(re);
        if (searchKey != null) {
            rf = rf.replace(searchKey[0], searchKey[0] + "\, \'\:jpush-react-native\'\, \'\:jcore-react-native\'\nproject\(\'\:jpush-react-native\'\)\.projectDir = new File\(rootProject\.projectDir\, \'\.\.\/node_modules\/jpush-react-native\/android\'\)\nproject\(\'\:jcore-react-native\'\)\.projectDir = new File\(rootProject\.projectDir\, \'\.\.\/node_modules\/jcore-react-native\/android\'\)\n");
            fs.writeFileSync(path, rf, "utf-8");
        } else {
            console.log("Did not find include in settings.gradle: " + path);
        }
    }

}

function configureGradle(path) {
    if (isFile(path) == false) {
        console.log("configuration JPush error!!");
        return;
    }

    var rf = fs.readFileSync(path, "utf-8");
    var isAlreadyWrite = rf.match(/.*jpush-react-native.*/);
    if (isAlreadyWrite == null) {
        var searchKey = rf.match(/\n.*compile fileTree.*\n/);
        if (searchKey != null) {
            rf = rf.replace(searchKey[0], searchKey[0] + "    compile project\(\'\:jpush-react-native\'\)\n    compile project\(\'\:jcore-react-native\'\)\n");
            fs.writeFileSync(path, rf, "utf-8");
        } else {
            console.log("Did not find \"compile\" in path: " + path);
        }
    }
}
