package host.exp.exponent;


import com.facebook.react.ReactPackage;

import java.util.Arrays;
import java.util.List;

import expo.core.interfaces.Package;
import expo.loaders.provider.interfaces.AppLoaderPackagesProviderInterface;
// import expo.modules.ads.admob.AdMobPackage;
// import expo.modules.analytics.segment.SegmentPackage;
// import expo.modules.appauth.AppAuthPackage;
// import expo.modules.backgroundfetch.BackgroundFetchPackage;
// import expo.modules.barcodescanner.BarCodeScannerPackage;
// import expo.modules.camera.CameraPackage;
import expo.modules.constants.ConstantsPackage;
// import expo.modules.contacts.ContactsPackage;
// import expo.modules.facedetector.FaceDetectorPackage;
import expo.modules.filesystem.FileSystemPackage;
import expo.modules.font.FontLoaderPackage;
import expo.modules.gl.GLPackage;
// import expo.modules.google.signin.GoogleSignInPackage;
// import expo.modules.localauthentication.LocalAuthenticationPackage;
// import expo.modules.localization.LocalizationPackage;
// import expo.modules.location.LocationPackage;
// import expo.modules.medialibrary.MediaLibraryPackage;
// import expo.modules.permissions.PermissionsPackage;
// import expo.modules.print.PrintPackage;
// import expo.modules.sensors.SensorsPackage;
// import expo.modules.sms.SMSPackage;
// import expo.modules.taskManager.TaskManagerPackage;
import expolib_v1.okhttp3.OkHttpClient;
// Needed for `react-native link`
// import com.facebook.react.ReactApplication;
import com.rollbar.RollbarReactNative;
import com.rollbar.notifier.config.Config;
import com.rollbar.notifier.config.ConfigBuilder;
import com.rollbar.notifier.config.ConfigProvider;

import android.os.Handler;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import host.exp.exponent.NativeNotificationsPackage;

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
    return Arrays.<ReactPackage>asList(
        // Add your own packages here!
        new NativeNotificationsPackage(),

        // Needed for `react-native link`
        // new MainReactPackage(),
            RollbarReactNative.getPackage(),
            new RNDeviceInfo()
    );
  }

  public List<Package> getExpoPackages() {
    return Arrays.<Package>asList(
        new ConstantsPackage(),
        new FileSystemPackage(),
        new FontLoaderPackage(),
        new GLPackage()
        // new CameraPackage(),
        // new ConstantsPackage(),
        // new SensorsPackage(),
        // new FaceDetectorPackage(),
        // new GoogleSignInPackage(),
        // new PermissionsPackage(),
        // new SMSPackage(),
        // new PrintPackage(),
        // new MediaLibraryPackage(),
        // new SegmentPackage(),
        // new LocationPackage(),
        // new ContactsPackage(),
        // new BarCodeScannerPackage(),
        // new AdMobPackage(),
        // new LocalAuthenticationPackage(),
        // new LocalizationPackage(),
        // new AppAuthPackage(),
        // new TaskManagerPackage(),
        // new BackgroundFetchPackage()
    );
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

    RollbarReactNative.instance().configure(new ConfigProvider() {
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
