package com.diginest; // replace com.your-app-name with your app’s name
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import java.util.Map;
import java.util.HashMap;

public class RNENVConfigModule extends ReactContextBaseJavaModule {
    RNENVConfigModule(ReactApplicationContext context) {
        super(context);
    }

    @Override
    public String getName() {
        return "RNENVConfig";
    }

    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        String env, mode;
        if(BuildConfig.FLAVOR == "pandatest"){
            env="dev";
            mode="panda";
        }
        else if(BuildConfig.FLAVOR == "greentest"){
            env="dev";
            mode="green";
        }
        else if(BuildConfig.FLAVOR == "fashiontest"){
            env="dev";
            mode="fashion";
        }
        else if(BuildConfig.FLAVOR == "panda"){
            env="live";
            mode="panda";
        }
        else if(BuildConfig.FLAVOR == "green"){
            env="live";
            mode="green";
        }
        else if(BuildConfig.FLAVOR == "fashion"){
            env="live";
            mode="fashion";
        }
        constants.put("env", env);
        constants.put("mode", mode);
        return constants;
    }
}