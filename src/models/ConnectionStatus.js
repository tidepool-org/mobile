import NetInfo from "@react-native-community/netinfo";

class ConnectionStatusSingletonClass {
  constructor() {
    NetInfo.addEventListener(this.onStatusChange);

    this.isOnline = undefined;
    this.isOffline = undefined;
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

  onStatusChange = status => {
    const wasOnline = this.isOnline;
    const wasOffline = this.isOffline;
    const isOnline = status.isInternetReachable;
    const isOffline = !isOnline
    this.isOnline = isOnline;
    this.isOffline = isOffline;

    if (wasOnline !== isOnline) {
      this.listeners.forEach(listener => {
        listener({
          wasOnline,
          wasOffline,
          isOnline,
          isOffline,
        });
      });
    }
  };
}

const ConnectionStatus = new ConnectionStatusSingletonClass();
ConnectionStatus.initAsync();

export { ConnectionStatus };
