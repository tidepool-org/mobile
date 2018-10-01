package host.exp.exponent;

import com.crashlytics.android.Crashlytics;
import com.crashlytics.android.core.CrashlyticsCore;
import com.facebook.react.ReactPackage;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

import android.os.Handler;

import expolib_v1.okhttp3.OkHttpClient;

// Needed for `react-native link`
// import com.facebook.react.ReactApplication;
import com.rollbar.RollbarReactNative;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.rollbar.android.Rollbar;
import com.rollbar.android.provider.NotifierProvider;
import com.rollbar.api.payload.data.Client;
import com.rollbar.api.payload.data.Notifier;
import com.rollbar.api.payload.data.Person;
import com.rollbar.api.payload.data.Request;
import com.rollbar.api.payload.data.Server;
import com.rollbar.notifier.config.Config;
import com.rollbar.notifier.config.ConfigBuilder;
import com.rollbar.notifier.config.ConfigProvider;
import com.rollbar.notifier.filter.Filter;
import com.rollbar.notifier.fingerprint.FingerprintGenerator;
import com.rollbar.notifier.provider.Provider;
import com.rollbar.notifier.sender.Sender;
import com.rollbar.notifier.transformer.Transformer;
import com.rollbar.notifier.uuid.UuidGenerator;

import host.exp.exponent.NativeNotificationsPackage;
import io.fabric.sdk.android.Fabric;

public class MainApplication extends ExpoApplication {

  @Override
  public boolean isDebug() {
    return BuildConfig.DEBUG;
  }

  @Override
  public void onCreate() {
    super.onCreate();

    RollbarReactNative.init(this, "00788919100a467e8fb08144b427890e", "unspecified");
  }

  // Needed for `react-native link`
  public List<ReactPackage> getPackages() {
    return Arrays.<ReactPackage>asList(
        // Add your own packages here!
        new NativeNotificationsPackage(),

        // Needed for `react-native link`
        // new MainReactPackage(),
        RollbarReactNative.getPackage(), new RNDeviceInfo());
  }

  @Override
  public String gcmSenderId() {
    return getString(R.string.gcm_defaultSenderId);
  }

  @Override
  public boolean shouldUseInternetKernel() {
    return BuildVariantConstants.USE_INTERNET_KERNEL;
  }

  public static OkHttpClient.Builder okHttpClientBuilder(OkHttpClient.Builder builder) {
    // Customize/override OkHttp client here
    return builder;
  }

  public String environment;
  public String userId;
  public String username;
  public String userFullName;

  public void setEnvironment(final String environment) {
    this.environment = environment;

    Rollbar.instance().configure(new ConfigProvider() {
      @Override
      public Config provide(ConfigBuilder builder) {
        return builder.environment(environment).build();
      }
    });
  }

  public void setUser(String userId, String username, String userFullName) {
    this.userId = userId;
    this.username = username;
    this.userFullName = userFullName;

    RollbarReactNative.instance().setPersonData(userId, username, userFullName);
  }

  public void clearUser() {
    this.userId = null;
    this.username = null;
    this.userFullName = null;

    RollbarReactNative.instance().clearPersonData();
  }

  public void testNativeCrash() {
    final Handler handler = new Handler();
    handler.postDelayed(new Runnable() {
      @Override
      public void run() {
        throw new RuntimeException("testNativeCrash");
      }
    }, 500);
  }

  public void testLogWarning(String message) {
    RollbarReactNative.warning(message);
  }

  public void testLogError(String message) {
    RollbarReactNative.error(message);
  }
}
