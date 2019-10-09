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

  setUser({ userId, username, fullName, isDSAUser }) {
    try {
      this.TPNativeModule.setUser(userId, username, fullName, isDSAUser);
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
}

const TPNative = new TPNativeSingletonClass();

export { TPNative };
