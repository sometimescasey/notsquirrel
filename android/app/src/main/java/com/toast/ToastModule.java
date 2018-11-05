// ToastModule.java

package com.toast;

import android.widget.Toast;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.Map;
import java.util.HashMap;

public class ToastModule extends ReactContextBaseJavaModule {

  private static final String DURATION_SHORT_KEY = "SHORT";
  private static final String DURATION_LONG_KEY = "LONG";

  public ToastModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  // Note that ReactContextBaseJavaModule needs a method called 
  // getName which returns the string name of the NativeModule to get used in JS
  // So we override it

  @Override
  public String getName() {
  	return "ToastExample";
  }

  // This is an optional override but we can use it to pass constants
  @Override
  public Map<String, Object> getConstants() {
  	final Map<String, Object> constants = new HashMap<>();
  	constants.put(DURATION_SHORT_KEY, Toast.LENGTH_SHORT);
  	constants.put(DURATION_LONG_KEY, Toast.LENGTH_LONG);
  	return constants;
  }

  // To expose a Java method to javascript, it must be annotated using ReactMethod
  @ReactMethod
  public void show(String message, int duration) {
  	Toast.makeText(getReactApplicationContext(), message, duration).show();
  }

}