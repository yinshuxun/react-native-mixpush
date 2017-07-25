package com.shuxun.react_native_mixpush.jPush;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.JavaScriptModule;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class JPushPackage implements ReactPackage {

    private boolean SHUTDOWN_TOAST = true;
    private boolean SHUTDOWN_LOG = true;


    public JPushPackage() {
        Logger.SHUTDOWNTOAST = SHUTDOWN_TOAST;
        Logger.SHUTDOWNLOG = SHUTDOWN_LOG;
    }

    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        return Arrays.asList(new NativeModule[]{
                new JPushModule(reactContext),
        });
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
