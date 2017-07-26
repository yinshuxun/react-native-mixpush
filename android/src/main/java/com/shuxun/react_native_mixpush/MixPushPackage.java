package com.shuxun.react_native_mixpush;

import android.util.Log;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.JavaScriptModule;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import com.shuxun.react_native_mixpush.jPush.JPushModule;
import com.shuxun.react_native_mixpush.miPush.MiPushModule;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Created by shuxun on 2017/7/24.
 */

public class MixPushPackage implements ReactPackage {
    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();
        if (Rom.isMiui()) {
            Log.e("ROM", "miui");
            modules.add(new MiPushModule(reactContext));
        } else {
            Log.e("ROM", "other");
            modules.add(new JPushModule(reactContext));
        }
        return modules;
    }

    @Override
    public List<Class<? extends JavaScriptModule>> createJSModules() {
        return Collections.emptyList();

    }

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }
}
