import { Platform } from "react-native";

import makeFontStyle from "../utils/makeFontStyle";
import Colors from "../constants/Colors";

const PrimaryTheme = {
  colors: {
    lightBackgroundColor: Colors.veryLightGrey,
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
      fontWeightName: "Light",
      fontSize: 17.5,
    }),
    alignSelf: "center",
  },
  noteListItemTextStyle: {
    color: "black",
    ...makeFontStyle({
      fontFamilyBaseName: "OpenSans",
      fontWeightName: "Regular",
      fontSize: 15,
    }),
  },
  versionStringStyle: {
    color: Colors.warmGrey,
    ...makeFontStyle({
      fontFamilyBaseName: "OpenSans",
      fontWeightName: "Regular",
      fontSize: 17,
    }),
  },
  madePossibleByTextStyle: {
    color: Colors.warmGrey,
    ...makeFontStyle({
      fontFamilyBaseName: "OpenSans",
      fontWeightName: "Semibold",
      fontSize: 17,
    }),
  },
  drawerMenuConnectToHealthTextStyle: {
    color: Colors.darkPurple,
    ...makeFontStyle({
      fontFamilyBaseName: "OpenSans",
      fontWeightName: "Regular",
      fontSize: 15,
    }),
  },
  drawerMenuCurrentUserTextStyle: {
    color: Colors.brightBlue,
    ...makeFontStyle({
      fontFamilyBaseName: "OpenSans",
      fontWeightName: "Semibold",
      fontSize: 15,
    }),
  },
  drawerMenuButtonStyle: {
    titleColorGrey: Colors.mediumLightGrey,
    titleColorBlue: Colors.brightBlue,
    titleColorActive: "white",
    titleFontStyle: {
      ...makeFontStyle({
        fontFamilyBaseName: "OpenSans",
        fontWeightName: "Regular",
        fontSize: 15,
      }),
    },
    subtitleFontStyle: {
      ...makeFontStyle({
        fontFamilyBaseName: "OpenSans",
        fontWeightName: "Semibold",
        fontSize: 10,
      }),
    },
    underlayColor: Colors.brightBlue,
  },
  wrongEmailOrPasswordTextStyle: {
    color: Colors.redError,
    ...makeFontStyle({
      fontFamilyBaseName: "OpenSans",
      fontWeightName: "Semibold",
      fontSize: 17,
    }),
  },
  forgotPasswordTextStyle: {
    color: Colors.warmGrey,
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
