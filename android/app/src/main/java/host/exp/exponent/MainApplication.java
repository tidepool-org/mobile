package host.exp.exponent;

import com.facebook.react.ReactPackage;

import org.unimodules.core.interfaces.Package;

import java.util.Arrays;
import java.util.List;

import expo.loaders.provider.interfaces.AppLoaderPackagesProviderInterface;
import host.exp.exponent.generated.BasePackageList;
import okhttp3.OkHttpClient;
import android.os.Handler;
import com.facebook.react.modules.storage.ReactDatabaseSupplier;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.rollbar.notifier.config.Config;
import com.rollbar.notifier.config.ConfigBuilder;
import com.rollbar.notifier.config.ConfigProvider;
import com.rollbar.RollbarReactNative;

// Needed for `react-native link`
// import com.facebook.react.ReactApplication;

public class MainApplication extends ExpoApplication implements AppLoaderPackagesProviderInterface<ReactPackage> {

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
    // Increase the maximum size of AsyncStorage
    long maximumDatabaseSize = 100L * 1024L * 1024L; // 100 MB in bytes
    ReactDatabaseSupplier.getInstance(getApplicationContext()).setMaximumSize(maximumDatabaseSize );

    return Arrays.<ReactPackage>asList(
        // Add your own packages here!
        new TPNativePackage(),

        // Needed for `react-native link`
        // new MainReactPackage(),
            RollbarReactNative.getPackage(),
            new RNDeviceInfo()
    );
  }

  public List<Package> getExpoPackages() {
    return new BasePackageList().getPackageList();
  }

  @Override
  public String gcmSenderId() {
    return getString(R.string.gcm_defaultSenderId);
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

    RollbarReactNative.instance().configure(new ConfigProvider() {
      @Override
      public Config provide(ConfigBuilder builder) {
        return builder.environment(environment).build();
      }
    });
  }

  public void setUser(String userId, String username, String userFullName, boolean isDSAUser) {
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
