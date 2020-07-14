package host.exp.exponent;

import android.content.Context;
import android.content.res.AssetManager;
import android.os.Handler;
import com.facebook.react.modules.storage.ReactDatabaseSupplier;
import com.facebook.react.ReactPackage;
import com.google.firebase.analytics.FirebaseAnalytics;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.rollbar.notifier.config.Config;
import com.rollbar.notifier.config.ConfigBuilder;
import com.rollbar.notifier.config.ConfigProvider;
import com.rollbar.RollbarReactNative;
import expo.loaders.provider.interfaces.AppLoaderPackagesProviderInterface;
import java.io.InputStream;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import host.exp.exponent.generated.BasePackageList;
import okhttp3.OkHttpClient;
import org.json.JSONObject;
import org.unimodules.core.interfaces.Package;

// Needed for `react-native link`
// import com.facebook.react.ReactApplication;

public class MainApplication extends ExpoApplication implements AppLoaderPackagesProviderInterface<ReactPackage> {

  private FirebaseAnalytics mFirebaseAnalytics;

  @Override
  public boolean isDebug() {
    return BuildConfig.DEBUG;
  }

  @Override
  public void onCreate() {
    super.onCreate();

    mFirebaseAnalytics = FirebaseAnalytics.getInstance(this);

    try {
      String servicesFile = AssetJSONFile("services.json", getApplicationContext());
      JSONObject json = new JSONObject(servicesFile);
      String ROLLBAR_POST_CLIENT_TOKEN = json.getString("ROLLBAR_POST_CLIENT_TOKEN");
      System.out.println("ROLLBAR_POST_CLIENT_TOKEN" + ROLLBAR_POST_CLIENT_TOKEN);
      RollbarReactNative.init(this, ROLLBAR_POST_CLIENT_TOKEN, "unspecified");
    } catch (Exception e) { }
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
    return "";
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
        throw new RuntimeException("Test Crash");
      }
    }, 500);
  }

  public void testLogWarning(String message) {
     RollbarReactNative.warning(message);
  }

  public void testLogError(String message) {
     RollbarReactNative.error(message);
  }

  private static String AssetJSONFile(String filename, Context context) throws IOException {
      AssetManager assetManager = context.getAssets();
      InputStream stream = assetManager.open(filename);
      byte[] buffer = new byte[stream.available()];
      stream.read(buffer);
      stream.close();

      return new String(buffer);
  }
}
