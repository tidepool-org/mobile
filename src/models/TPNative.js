import { NativeModules, NativeEventEmitter } from "react-native";

class TPNativeSingletonClass {
  constructor() {
    this.listeners = [];

    try {
      this.TPNativeModule = NativeModules.TPNative;

      const events = new NativeEventEmitter(NativeModules.TPNative);
      events.addListener(
        "onShareWillBeginPreview",
        this.onShareWillBeginPreview
      );
      events.addListener(
        "onShareDidEndPreview",
        this.onShareDidEndPreview
      );
    } catch (error) {
      // console.log(`error: ${error}`);
    }
  }

  clearUser() {
    try {
      this.TPNativeModule.clearUser();
    } catch (error) {
      // console.log(`error: ${error}`);
    }
  }

  setUser({ userId, username, fullName, isDSAUser, sessionToken }) {
    try {
      this.TPNativeModule.setUser(
        userId,
        username,
        fullName,
        isDSAUser,
        sessionToken
      );
    } catch (error) {
      // console.log(`error: ${error}`);
    }
  }

  setEnvironment(environment) {
    try {
      this.TPNativeModule.setEnvironment(environment);
    } catch (error) {
      // console.log(`error: ${error}`);
    }
  }

  testNativeCrash() {
    try {
      this.TPNativeModule.testNativeCrash();
    } catch (error) {
      // console.log(`error: ${error}`);
    }
  }

  testLogWarning(message) {
    try {
      this.TPNativeModule.testLogWarning(message);
    } catch (error) {
      // console.log(`error: ${error}`);
    }
  }

  testLogError(message) {
    try {
      this.TPNativeModule.testLogError(message);
    } catch (error) {
      // console.log(`error: ${error}`);
    }
  }

  isUploaderLoggingEnabled() {
    try {
      return this.TPNativeModule.isUploaderLoggingEnabled();
    } catch (error) {
      // console.log(`error: ${error}`);
    }
    return false;
  }

  enableUploaderLogging(enable) {
    try {
      this.TPNativeModule.enableUploaderLogging(enable);
    } catch (error) {
      // console.log(`error: ${error}`);
    }
  }

  shareUploaderLogs() {
    try {
      this.TPNativeModule.shareUploaderLogs();
    } catch (error) {
      // console.log(`error: ${error}`);
    }
  }

  onShareWillBeginPreview = () => {
    this.notify("onShareWillBeginPreview");
  };

  onShareDidEndPreview = () => {
    this.notify("onShareDidEndPreview");
  };

  addListener(listener) {
    this.listeners.push(listener);
  }

  removeListener(listener) {
    const index = this.listeners.indexOf(listener);
    if (index > 0) {
      this.listeners.splice(index, 1);
    }
  }

  notify(eventName, eventParams) {
    this.listeners.forEach(listener => listener(eventName, eventParams));
  }
}

const TPNative = new TPNativeSingletonClass();

export { TPNative };
