import React from "react";
import PropTypes from "prop-types";
import { ThemeProvider } from "glamorous-native";

import Drawer from "../components/Drawer";
import PrimaryTheme from "../themes/PrimaryTheme";

const DrawerContainer = ({ navigation }) => (
  <ThemeProvider theme={PrimaryTheme}>
    <Drawer
      navigation={navigation}
      style={{
        flex: 1,
        marginTop: 0,
      }}
      currentUser={{ username: "email@gmail.com" }} // TODO: redux
    />
  </ThemeProvider>
);

DrawerContainer.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};

export default DrawerContainer;
