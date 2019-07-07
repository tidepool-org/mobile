import { differenceInMilliseconds } from "date-fns";
import { Alert } from "react-native";

class AlertManager {
  alertTitleDiscard = "Discard?";
  alertTitleDelete = "Delete?";
  alertTitleOffline = "No Network Connection";
  alertTitleUnknownError = "Unknown Error Occurred";
  alertButtonTextCancel = "Cancel";
  alertButtonTextDiscard = "Discard";
  alertButtonTextDelete = "Delete";
  alertButtonTextSave = "Save";

  showDiscardOrSaveAlert({ message, onPressDiscard, onPressSave }) {
    Alert.alert("Save?", message, [
      {
        text: this.alertButtonTextDiscard,
        onPress: onPressDiscard,
        style: "destructive",
      },
      {
        text: this.alertButtonTextSave,
        onPress: onPressSave,
      },
    ]);
  }

  showCancelOrDestructiveAlert({
    title,
    message,
    destructiveButtonText,
    onPress,
  }) {
    Alert.alert(title, message, [
      {
        text: this.alertButtonTextCancel,
        style: "cancel",
      },
      {
        text: destructiveButtonText,
        onPress,
        style: "destructive",
      },
    ]);
  }

  showOfflineMessage(message) {
    Alert.alert(this.alertTitleOffline, message, [{ text: "OK" }]);
  }

  showError(errorMessage) {
    const showErrorTime = new Date();

    if (
      !this.lastShowErrorTime ||
      Math.abs(
        differenceInMilliseconds(this.lastShowErrorTime, showErrorTime)
      ) > 500
    ) {
      if (errorMessage === "Network Error") {
        Alert.alert(
          this.alertTitleOffline,
          `It seems you’re offline, so your notes can’t be loaded or saved.`,
          [{ text: "OK" }]
        );
      } else {
        Alert.alert(
          this.alertTitleUnknownError,
          `An unknown error occurred. We are working hard to resolve this issue.`,
          [{ text: "OK" }]
        );
      }
    } else {
      // console.log(
      //   `Skipping error message since sent too quickly after previous one: ${errorMessage}`
      // );
    }

    this.lastShowErrorTime = showErrorTime;
  }
}

export default new AlertManager();
