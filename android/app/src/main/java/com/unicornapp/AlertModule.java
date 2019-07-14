package com.unicornapp;


import androidx.appcompat.app.AlertDialog;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;


import javax.annotation.Nonnull;

public class AlertModule extends ReactContextBaseJavaModule {


    public AlertModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @ReactMethod
    public void show(String message) {
        new AlertDialog.Builder(getCurrentActivity())
                .setMessage(message)
                .setCancelable(true)
                .setNeutralButton(android.R.string.ok, null)
                .setIcon(android.R.drawable.ic_dialog_alert)
                .show();
    }


    @Nonnull
    @Override
    public String getName() {
        return "NativeAlert";
    }
}