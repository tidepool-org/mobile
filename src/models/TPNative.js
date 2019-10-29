import { NativeModules } from "react-native";

class TPNativeSingletonClass {
  constructor() {
    this.TPNativeModule = NativeModules.TPNative;
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

  emailUploaderLogs() {
    try {
      this.TPNativeModule.emailUploaderLogs();
    } catch (error) {
      // console.log(`error: ${error}`);
    }
  }
}

const TPNative = new TPNativeSingletonClass();

export { TPNative };
