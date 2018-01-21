import React, { PureComponent } from "react";
import { StatusBar } from "react-native";
import glamorous from "glamorous-native";

class LaunchScreen extends PureComponent {
  render() {
    // console.log("LaunchScreen: render");

    return (
      <glamorous.View flex={1} backgroundColor="white">
        <StatusBar barStyle="dark-content" />
      </glamorous.View>
    );
  }
}

export default LaunchScreen;

// TODO: FIXME: HACK: In RCTRootView.m we need to remove the center layout for the loadingview on iOS in RCTRootView.m! It's causing a layout shift
// - (void)layoutSubviews
// {
//   [super layoutSubviews];
//   _contentView.frame = self.bounds;
//   _loadingView.center = (CGPoint){
//     CGRectGetMidX(self.bounds),
//     CGRectGetMidY(self.bounds)
//   };
// }
