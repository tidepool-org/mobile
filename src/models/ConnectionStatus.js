import { NetInfo } from "react-native";

class ConnectionStatus {
  constructor() {
    this.connectionInfo = {
      type: "unknown",
    };

    NetInfo.getConnectionInfo().then(this.onConnectionChange);
    NetInfo.addEventListener("connectionChange", this.onConnectionChange);
  }

  onConnectionChange = connectionInfo => {
    this.connectionInfo = connectionInfo;
  };

  isOffline() {
    return this.connectionInfo.type === "none";
  }
}

export default new ConnectionStatus();
