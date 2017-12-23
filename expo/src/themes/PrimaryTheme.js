import { Platform } from "react-native";

import FontStyles from "../constants/FontStyles";
import Colors from "../constants/Colors";

const PrimaryTheme = {
  colors: {
    lightBackground: Colors.veryLightGrey,
    activityIndicator: Platform.OS === "android" ? Colors.brightBlue : "grey",
  },
  navHeaderTitleStyle: {
    color: "white",
    ...FontStyles.navTitleFont,
    alignSelf: "center",
  },
  notesListItemTimeStyle: {
    color: Colors.altDarkGreyColor,
    ...FontStyles.smallRegularFont,
  },
  notesListItemTextStyle: {
    color: Colors.blackish,
    ...FontStyles.mediumSmallRegularFont,
  },
  notesListItemHashtagStyle: {
    color: Colors.blackish,
    ...FontStyles.mediumSmallBoldFont,
  },
  versionStringStyle: {
    color: Colors.warmGrey,
    ...FontStyles.mediumRegularFont,
  },
  smallVersionStringStyle: {
    color: Colors.warmGrey,
    ...FontStyles.smallRegularFont,
  },
  madePossibleByTextStyle: {
    color: Colors.warmGrey,
    ...FontStyles.mediumSemiboldFont,
  },
  listItemName: {
    color: Colors.darkPurple,
    ...FontStyles.mediumSmallRegularFont,
  },
  drawerMenuConnectToHealthTextStyle: {
    color: Colors.darkPurple,
    ...FontStyles.mediumSmallRegularFont,
  },
  drawerMenuCurrentUserTextStyle: {
    color: Colors.brightBlue,
    ...FontStyles.mediumSmallSemiboldFont,
  },
  titleColorActive: "white",
  underlayColor: Colors.brightBlue,
  drawerMenuButtonStyle: {
    titleColorGrey: Colors.mediumLightGrey,
    titleColorBlue: Colors.brightBlue,
    titleFontStyle: {
      ...FontStyles.mediumSmallRegularFont,
    },
    subtitleFontStyle: {
      ...FontStyles.verySmallSemiboldFont,
    },
  },
  wrongEmailOrPasswordTextStyle: {
    color: Colors.redError,
    ...FontStyles.mediumSemiboldFont,
  },
  forgotPasswordTextStyle: {
    color: Colors.warmGrey,
    ...FontStyles.mediumRegularFont,
  },
  signUpTextStyle: {
    ...FontStyles.mediumBoldFont,
  },
  signInEditFieldStyle: {
    ...FontStyles.largeRegularFont,
    ...Platform.select({
      ios: {
        backgroundColor: "white",
      },
    }),
  },
  signInEditFieldExtra: {
    keyboardAppearance: "dark",
  },
  debugSettingsHeaderTitleStyle: {
    color: Colors.blackish,
    ...FontStyles.navTitleFont,
    alignSelf: "center",
  },
  debugSettingsSectionTitleStyle: {
    color: Colors.altDarkGreyColor,
    ...FontStyles.mediumSmallRegularFont,
  },
  debugSettingsListItemTextStyle: {
    color: Colors.blackish,
    ...FontStyles.mediumSmallRegularFont,
  },
};

export default PrimaryTheme;
