package com.shuxun.react_native_mixpush.miPush;

import android.content.Intent;
import android.os.Bundle;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.xiaomi.mipush.sdk.MiPushMessage;
import com.xiaomi.mipush.sdk.PushMessageHelper;

import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Set;

/**
 * Created by shuxun on 2017/7/26.
 */

public class MiPushHelper {
    public static WritableMap getDataOfIntent(Intent intent) {
        if (intent == null) {
            return null;
        }

        final Set<String> categories = new HashSet<String>(Arrays.asList(Intent.CATEGORY_LAUNCHER));
        if (intent.getAction() != Intent.ACTION_MAIN || !categories.equals(intent.getCategories())) {
            return null;
        }

        MiPushMessage message = (MiPushMessage)intent.getSerializableExtra(PushMessageHelper.KEY_MESSAGE);
        if (message == null) {
            return null;
        }

        Bundle bundle = message.toBundle();
        HashMap<String, String> extra = (HashMap<String, String>)bundle.getSerializable("extra");
        if (extra != null) {
            Bundle extraBundle = new Bundle();
            for (String key: extra.keySet()) {
                String value = extra.get(key);
                extraBundle.putString(key, value);
            }
            bundle.putBundle("extra", extraBundle);
        }

        WritableMap params = Arguments.fromBundle(bundle);
        return params;
    }
}
