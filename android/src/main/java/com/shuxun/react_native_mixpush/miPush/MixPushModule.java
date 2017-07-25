package com.shuxun.react_native_mixpush.miPush;

import android.content.Context;
import android.util.Log;
import android.widget.Toast;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.shuxun.react_native_mixpush.ExampleUtil;
import com.xiaomi.channel.commonutils.logger.LoggerInterface;
import com.xiaomi.mipush.sdk.Logger;
import com.xiaomi.mipush.sdk.MiPushClient;

/**
 * Created by shuxun on 2017/7/24.
 */

public class MixPushModule extends ReactContextBaseJavaModule {


    public MixPushModule(ReactApplicationContext reactContext) {
        super(reactContext);
        initXiaomiPush();
    }

    @Override
    public String getName() {
        return "mixPushModule";
    }

    @Override
    public void initialize() {
        super.initialize();
    }

    /**
     * 初始化小米消息推送
     **/
    private void initXiaomiPush() {
        // 注册push服务，注册成功后会向DemoMessageReceiver发送广播
        // 可以从DemoMessageReceiver的onCommandResult方法中MiPushCommandMessage对象参数中获取注册信息
        //小米消息推送APP_ID ，APP_KEY
        String APP_ID = ExampleUtil.getMiAppId(getReactApplicationContext());
        String APP_KEY = ExampleUtil.getMiAppKey(getReactApplicationContext());
//        String APP_ID = "2882303761517599402";
//        String APP_KEY = "5351759930402";

        Context mContext = getReactApplicationContext();

        if (shouldInit()) {
            MiPushClient.registerPush(mContext, APP_ID, APP_KEY);
        }

        LoggerInterface newLogger = new LoggerInterface() {
            public static final String TAG = "mixpush";

            @Override
            public void setTag(String tag) {
                // ignore
            }

            @Override
            public void log(String content, Throwable t) {
                Log.d(TAG, content, t);
            }

            @Override
            public void log(String content) {
                Log.d(TAG, content);
            }
        };

        Logger.setLogger(mContext, newLogger);
    }

    private boolean shouldInit() {
//        ActivityManager am = ((ActivityManager) getSystemService(Context.ACTIVITY_SERVICE));
//        List<ActivityManager.RunningAppProcessInfo> processInfos = am.getRunningAppProcesses();
//        String mainProcessName = getPackageName();
//        int myPid = Process.myPid();
//        for (ActivityManager.RunningAppProcessInfo info : processInfos) {
//            if (info.pid == myPid && mainProcessName.equals(info.processName)) {
//                return true;
//            }
//        }
        return true;
    }


}
