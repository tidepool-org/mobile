import React, { useEffect } from "react";
import { UIManager } from "react-native";
import { connect } from "react-redux";

const AppWithNavigationState = ({ navigation }) => {
  useEffect(() => {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  return <AppNavigation />;
};

const mapStateToProps = (state) => ({
  navigation: state.navigation,
});

export default connect(mapStateToProps)(AppWithNavigationState);





