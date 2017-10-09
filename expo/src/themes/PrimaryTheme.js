import { Platform } from "react-native";

const PrimaryTheme = {
  colors: {
    lightBackgroundColor: "#f7f7f8",
  },
  fonts: {
    "OpenSans-Bold": require("../../assets/fonts/OpenSans-Bold.ttf"),
    "OpenSans-Light": require("../../assets/fonts/OpenSans-Light.ttf"),
    "OpenSans-Regular": require("../../assets/fonts/OpenSans-Regular.ttf"),
    "OpenSans-Semibold": require("../../assets/fonts/OpenSans-Semibold.ttf"),
  },
  versionStringStyle: {
    color: "#9B9B9B",
    fontFamily: "OpenSans-Regular",
    fontSize: 17,
  },
  madePossibleByTextStyle: {
    color: "#9B9B9B",
    fontFamily: "OpenSans-Semibold",
    fontSize: 17,
  },
  wrongEmailOrPasswordTextStyle: {
    color: "#ff354e",
    fontFamily: "OpenSans-Semibold",
    fontSize: 17,
  },
  forgotPasswordTextStyle: {
    color: "#9B9B9B",
    fontFamily: "OpenSans-Regular",
    fontSize: 17,
  },
  signUpTextStyle: {
    fontFamily: "OpenSans-Bold",
    fontSize: 17,
  },
  signInEditFieldStyle: {
    fontFamily: "OpenSans-Regular",
    fontSize: 18,
    ...Platform.select({
      ios: {
        backgroundColor: "white",
      },
    }),
  },
  signInEditFieldExtra: {
    keyboardAppearance: "dark",
  },
};

export default PrimaryTheme;
