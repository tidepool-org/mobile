import { Platform } from "react-native";

import makeFontStyle from "../utils/makeFontStyle";

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
  navHeaderTitleStyle: {
    color: "white",
    ...makeFontStyle({
      fontFamilyBaseName: "OpenSans",
      fontWeightName: "Regular",
      fontSize: 17.5,
    }),
    alignSelf: "center",
  },
  noteListItemTextStyle: {
    color: "#000",
    ...makeFontStyle({
      fontFamilyBaseName: "OpenSans",
      fontWeightName: "Regular",
      fontSize: 15,
    }),
  },
  versionStringStyle: {
    color: "#9B9B9B",
    ...makeFontStyle({
      fontFamilyBaseName: "OpenSans",
      fontWeightName: "Regular",
      fontSize: 17,
    }),
  },
  madePossibleByTextStyle: {
    color: "#9B9B9B",
    ...makeFontStyle({
      fontFamilyBaseName: "OpenSans",
      fontWeightName: "Semibold",
      fontSize: 17,
    }),
  },
  wrongEmailOrPasswordTextStyle: {
    color: "#ff354e",
    ...makeFontStyle({
      fontFamilyBaseName: "OpenSans",
      fontWeightName: "Semibold",
      fontSize: 17,
    }),
  },
  forgotPasswordTextStyle: {
    color: "#9B9B9B",
    ...makeFontStyle({
      fontFamilyBaseName: "OpenSans",
      fontWeightName: "Regular",
      fontSize: 17,
    }),
  },
  signUpTextStyle: {
    ...makeFontStyle({
      fontFamilyBaseName: "OpenSans",
      fontWeightName: "Bold",
      fontSize: 17,
    }),
  },
  signInEditFieldStyle: {
    ...makeFontStyle({
      fontFamilyBaseName: "OpenSans",
      fontWeightName: "Regular",
      fontSize: 18,
    }),
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
