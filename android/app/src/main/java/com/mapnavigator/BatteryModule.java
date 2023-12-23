package com.mapnavigator;
import static androidx.core.content.ContextCompat.getSystemService;

import android.content.Context;
import android.os.PowerManager;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import java.util.Map;
import java.util.HashMap;

public class BatteryModule extends ReactContextBaseJavaModule {
    BatteryModule(ReactApplicationContext context) {
       super(context);
   }
    private Context mContext;
    @Override
    public String getName() {
        return "BatteryModule";
    }

    @ReactMethod
    public void getBatteryOptimisationStatus(Promise promise) {
        try {
            this.mContext = getCurrentActivity();
            PowerManager pm = (PowerManager) mContext.getSystemService(Context.POWER_SERVICE);
            boolean isPowerSaveMode = false;
            if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.LOLLIPOP) {
                isPowerSaveMode = pm.isPowerSaveMode();
            }
            System.out.println("ispwer " + isPowerSaveMode);
            promise.resolve(isPowerSaveMode);
        }catch(Exception e)
        {
            promise.reject(e);
        }
    }

}