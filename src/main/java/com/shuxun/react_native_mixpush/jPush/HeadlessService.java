package com.shuxun.react_native_mixpush.jPush;

import android.content.Intent;
import android.os.Bundle;
import android.support.annotation.Nullable;

import com.facebook.react.HeadlessJsTaskService;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.jstasks.HeadlessJsTaskConfig;


public class HeadlessService extends HeadlessJsTaskService {

    public static final String HEADLESS_TASK_NAME = "headlessJsTask";

    @Override
    protected @Nullable
    HeadlessJsTaskConfig getTaskConfig(Intent intent) {
        Bundle extras = intent.getBundleExtra("data");
        if (extras != null) {
            return new HeadlessJsTaskConfig(
                    HEADLESS_TASK_NAME,
                    Arguments.fromBundle(extras),
                    30);
        }
        return null;
    }

}
