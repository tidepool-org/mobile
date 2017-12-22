package io.tidepool.urchinRN.LaunchScreen;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class LaunchScreenModule extends ReactContextBaseJavaModule {
  public LaunchScreenModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  public String getName() {
    return "LaunchScreen";
  }

  /**
   * showActivityIndicator
   */
  @ReactMethod
  public void showActivityIndicator() {
    // TODO
  }

  /**
   * hide
   */
  @ReactMethod
  public void hide() {
    // TODO
  }
}