package com.shuxun.react_native_mixpush.miPush;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.telephony.TelephonyManager;
import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.shuxun.react_native_mixpush.mixPushUtil;
import com.xiaomi.channel.commonutils.logger.LoggerInterface;
import com.xiaomi.mipush.sdk.Logger;
import com.xiaomi.mipush.sdk.MiPushClient;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Created by shuxun on 2017/7/24.
 */

public class MiPushModule extends ReactContextBaseJavaModule {

    private Intent mIntent;
    private static Boolean registered = false;
    private static MiPushModule gModules = null;
    private static String holdMessage = null;
    private static String deviceId = null;


    public MiPushModule(ReactApplicationContext reactContext) {
        super(reactContext);
        if (!registered) {
            initXiaomiPush();
            registered = true;
            gModules = this;
            try {
                TelephonyManager telephonyManager = (TelephonyManager)reactContext.getSystemService(Context.TELEPHONY_SERVICE);
                deviceId = telephonyManager.getDeviceId();
            } catch (Exception e) {
                deviceId = "unknow";
            }
        }
    }

    @Override
    public String getName() {
        return "MiPushModule";
    }

    @Override
    public void initialize() {
        super.initialize();
        gModules = this;
    }

    /**
     * 初始化小米消息推送
     **/
    private void initXiaomiPush() {
        // 注册push服务，注册成功后会向DemoMessageReceiver发送广播
        // 可以从DemoMessageReceiver的onCommandResult方法中MiPushCommandMessage对象参数中获取注册信息
        //小米消息推送APP_ID ，APP_KEY
        String APP_ID = mixPushUtil.getMiAppId(getReactApplicationContext());
        String APP_KEY = mixPushUtil.getMiAppKey(getReactApplicationContext());

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

    public static void sendEvent(Bundle bundle) {
        if (gModules != null){
            bundle.putString("device_id", deviceId);
            WritableMap message = Arguments.fromBundle(bundle);
            Log.d(TAG, message.toString());
            DeviceEventManagerModule.RCTDeviceEventEmitter emitter = gModules.getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class);
            emitter.emit("mipush", message);
            return;
        }
        else {
            Log.e(TAG, "sendEvent gModules is null.");
        }
    }

    public static final String TAG = "MPushReceiver";
    public static final String MiPush_didFinishLaunchingWithOptions = "MiPush_didFinishLaunchingWithOptions";
    public static final String MiPush_didRegisterUserNotificationSettings = "MiPush_didRegisterUserNotificationSettings";
    public static final String MiPush_didFailToRegisterForRemoteNotificationsWithError = "MiPush_didFailToRegisterForRemoteNotificationsWithError";
    public static final String MiPush_didRegisterForRemoteNotificationsWithDeviceToken = "MiPush_didRegisterForRemoteNotificationsWithDeviceToken";
    public static final String MiPush_didReceiveRemoteNotification = "MiPush_didReceiveRemoteNotification";
    public static final String MiPush_didNotificationMessageClicked = "MiPush_didNotificationMessageClicked";
    public static final String MiPush_didCommandResult = "MiPush_didCommandResult";
    public static final String MiPush_didReceivePassThroughMessage = "MiPush_didReceivePassThroughMessage";
    public static final String MiPush_didReceiveLocalNotification = "MiPush_didReceiveLocalNotification";
    public static final String MiPush_requestSuccWithSelector = "MiPush_requestSuccWithSelector";
    public static final String MiPush_requestErrWithSelector = "MiPush_requestErrWithSelector";

    @ReactMethod
    public void getInitialMessage(Promise promise) {
        WritableMap params = MiPushHelper.getDataOfIntent(mIntent);
        // Add missing NOTIFICATION_MESSAGE_CLICKED message in PushMessageReceiver
        if (params != null) {
            params.putString("type", "NOTIFICATION_MESSAGE_CLICKED");
        }
        promise.resolve(params);
    }

    @Override
    public void onCatalystInstanceDestroy() {
        super.onCatalystInstanceDestroy();
        gModules = null;
    }

    @ReactMethod
    public void setAlias(String alias) {
        MiPushClient.setAlias(getReactApplicationContext(), alias, "");
    }

    @ReactMethod
    public void unsetAlias(String alias) {
        MiPushClient.unsetAlias(getReactApplicationContext(), alias, "");
    }

    @ReactMethod
    public void setUserAccount(String userAccount) {
        MiPushClient.setUserAccount(getReactApplicationContext(), userAccount, "");
    }

    @ReactMethod
    public void unsetUserAccount(String userAccount) {
        MiPushClient.unsetUserAccount(getReactApplicationContext(), userAccount, "");
    }

    @ReactMethod
    public void subscribe(String topic) {
        MiPushClient.subscribe(getReactApplicationContext(), topic, "");
    }

    @ReactMethod
    public void unsubscribe(String topic) {
        MiPushClient.unsubscribe(getReactApplicationContext(), topic, "");
    }

    @ReactMethod
    public void pausePush(String category) {
        MiPushClient.pausePush(getReactApplicationContext(), category);
    }

    @ReactMethod
    public void resumePush(String category) {
        MiPushClient.resumePush(getReactApplicationContext(), category);
    }

    @ReactMethod
    public void setAcceptTime(int startHour, int startMin, int endHour, int endMin, String category) {
        MiPushClient.setAcceptTime(getReactApplicationContext(), startHour, startMin, endHour, endMin, category);
    }

    @ReactMethod
    public void getAllAlias(Promise promise) {
        List<String> allAlias = MiPushClient.getAllAlias(getReactApplicationContext());
        String[] allAliasArray = allAlias.toArray(new String[allAlias.size()]);
        promise.resolve(Arguments.fromArray(allAliasArray));
    }

    @ReactMethod
    public void getAllTopics(Promise promise) {
        List<String> allTopics = MiPushClient.getAllAlias(getReactApplicationContext());
        String[] allTopicsArray = allTopics.toArray(new String[allTopics.size()]);
        promise.resolve(Arguments.fromArray(allTopicsArray));
    }

    @ReactMethod
    public void reportMessageClicked(String msgId) {
        MiPushClient.reportMessageClicked(getReactApplicationContext(), msgId);
    }

    @ReactMethod
    public void clearNotification(int notifyId) {
        MiPushClient.clearNotification(getReactApplicationContext(), notifyId);
    }

    @ReactMethod
    public void clearAllNotification() {
        MiPushClient.clearNotification(getReactApplicationContext());
    }

    @ReactMethod
    public void setLocalNotificationType(int notifyType) {
        MiPushClient.setLocalNotificationType(getReactApplicationContext(), notifyType);
    }

    @ReactMethod
    public void clearLocalNotificationType() {
        MiPushClient.clearLocalNotificationType(getReactApplicationContext());
    }

    @ReactMethod
    public void getRegId(Promise promise) {
        MiPushClient.getRegId(getReactApplicationContext());
    }

    private Set _stringArrayToSet(ReadableArray array) {
        Set<String> set = new HashSet<String>();
        if (array != null) {
            int size = array.size();
            for (int i=0;i<size;i++) {
                String obj = array.getString(i);
                set.add(obj);
            }
        }
        return set;
    }
    private Set _intArrayToSet(ReadableArray array) {
        Set<Integer> set = new HashSet<Integer>();
        if (array != null) {
            int size = array.size();
            for (int i=0;i<size;i++) {
                Integer obj = array.getInt(i);
                set.add(obj);
            }
        }
        return set;
    }


}
