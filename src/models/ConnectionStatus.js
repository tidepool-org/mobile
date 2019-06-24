import { NetInfo } from "react-native";

class ConnectionStatus {
  constructor() {
    this.connectionInfo = "unknown";
    NetInfo.addEventListener("connectionChange", this.onConnectionChange);

    this.isOnline = false;
    this.isOffline = false;
    this.listeners = [];
  }

  async initAsync() {
    const isOnline = await NetInfo.isConnected.fetch();
    this.isOnline = isOnline;
    this.isOffline = !isOnline;
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
    this.connectionInfo = connectionInfo;
    const wasOnline = this.isOnline;
    const wasOffline = this.isOffline;
    const isOnline =
      connectionInfo.type === "wifi" || connectionInfo.type === "cellular";
    const isOffline = connectionInfo.type === "none";
    this.isOnline = isOnline;
    this.isOffline = isOffline;

    if (wasOnline !== isOnline) {
      this.listeners.forEach(listener => {
        listener({
          connectionInfo,
          previousConnectionInfo,
          wasOnline,
          wasOffline,
          isOnline,
          isOffline,
        });
      });
    }
  };
}

const connectionStatus = new ConnectionStatus();
connectionStatus.initAsync();

export default connectionStatus;
