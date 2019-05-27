import { NetInfo } from "react-native";

class ConnectionStatus {
  constructor() {
    this.connectionInfo = {
      type: "unknown",
    };

    NetInfo.getConnectionInfo().then(this.onConnectionChange);
    NetInfo.addEventListener("connectionChange", this.onConnectionChange);

    this.listeners = [];
  }

  isOffline() {
    // return true;
    return this.connectionInfo.type === "none";
  }

  isOnline() {
    return (
      this.connectionInfo.type !== "none" &&
      this.connectionInfo.type !== "unknown"
    );
  }

  addListener(listener) {
    this.listeners.push(listener);
  }

  removeListener(listener) {
    const index = this.listeners.indexOf(listener);
    if (index > 0) {
      this.listeners.splice(index, 1);
    }
  }

  //
  // Private
  //

  onConnectionChange = connectionInfo => {
    const previousConnectionInfo = this.connectionInfo;
    const wasOnline =
      previousConnectionInfo.type !== "none" &&
      previousConnectionInfo.type !== "unknown";
    const wasOffline = previousConnectionInfo.type === "none";

    this.connectionInfo = connectionInfo;

    this.listeners.forEach(listener => {
      listener({
        connectionInfo,
        previousConnectionInfo,
        wasOnline,
        wasOffline,
      });
    });
  };
}

export default new ConnectionStatus();
