import { differenceInMilliseconds } from "date-fns";
import { Alert } from "react-native";

class ErrorAlertManager {
  constructor() {
    this.observers = [];

    this.date = new Date();
  }

  showOfflineNetworkError() {
    this.show("Network Error");
  }

  show(errorMessage) {
    const date = new Date();

    if (Math.abs(differenceInMilliseconds(this.date, date)) > 500) {
      if (errorMessage === "Network Error") {
        Alert.alert(
          "No Network Connection",
          `It seems you’re offline, so your notes can’t be loaded or saved.`,
          [{ text: "OK" }]
        );
      } else {
        Alert.alert(
          "Unknown Error Occurred",
          `An unknown error occurred. We are working hard to resolve this issue.`,
          [{ text: "OK" }]
        );
      }
    } else {
      // console.log(
      //   `Skipping error message since sent too quickly after previous one: ${errorMessage}`
      // );
    }

    this.date = date;
  }
}

export default new ErrorAlertManager();