import React, { PureComponent } from "react";
import { ActivityIndicator, StatusBar } from "react-native";
import glamorous from "glamorous-native";

import PrimaryTheme from "../themes/PrimaryTheme";
// import { Logger } from "../models/Logger";

class LaunchScreen extends PureComponent {
  state = {
    isActivityIndicatorVisible: false,
  };

  theme = PrimaryTheme;

  componentDidMount() {
    // Start activity indicator after one second. This handles the case where we
    // have a session token and are refreshing that token on launch, but, it's
    // taking a long time (likely due to slow connection, or possibly slow
    // backend). This way user isn't just staring at a blank white screen during
    // this time!
    this.startActivityIndicatorTimer = setTimeout(() => {
      this.setState({
        isActivityIndicatorVisible: true,
      });
    }, 1000);
  }

  componentWillUnmount() {
    if (this.startActivityIndicatorTimer) {
      clearTimeout(this.startActivityIndicatorTimer);
    }
  }

  render() {
    // console.log(`LaunchScreen: render`);

    const { isActivityIndicatorVisible } = this.state;

    return (
      <glamorous.View flex={1} backgroundColor="white" justifyContent="center">
        <StatusBar barStyle="dark-content" />
        <glamorous.View
          style={{
            height: 62,
          }}
        >
          <ActivityIndicator
            style={{
              height: 62,
              alignSelf: "center",
            }}
            size="large"
            color={this.theme.colors.activityIndicator}
            animating={isActivityIndicatorVisible}
          />
        </glamorous.View>
      </glamorous.View>
    );
  }
}

export default LaunchScreen;
