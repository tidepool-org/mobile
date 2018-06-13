import { Platform } from "react-native";

import FontStyles from "../constants/FontStyles";
import Colors from "../constants/Colors";

const PrimaryTheme = {
  colors: {
    lightBackground: Colors.veryLightGrey,
    activityIndicator: Platform.OS === "android" ? Colors.brightBlue : "grey",
  },
  screenHeaderTitleStyle: {
    color: "white",
    ...FontStyles.navTitleFont,
    alignSelf: "center",
  },
  notesListItemMetadataStyle: {
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
  searchBarTextStyle: {
    color: Colors.blackish,
    ...FontStyles.mediumSmallLightFont,
  },
  searchBarPlaceholderTextColor: Colors.warmGrey,
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
  addCommentTextStyle: {
    color: Colors.mediumLightGrey,
    ...FontStyles.mediumSmallSemiboldFont,
  },
  notesListItemUserFullNameStyle: {
    color: Colors.darkGreyColor,
    ...FontStyles.smallSemiboldFont,
  },
  notesListItemCommentTimeStyle: {
    color: Colors.altLightGreyColor,
    ...FontStyles.smallRegularFont,
  },
  notesListItemCommentTextStyle: {
    color: "#8c8c8c",
    ...FontStyles.smallRegularFont,
  },
  notesListItemCommentHashtagStyle: {
    color: "#8c8c8c",
    ...FontStyles.smallBoldFont,
  },
  editButtonTextStyle: {
    color: Colors.brightBlue,
    ...FontStyles.smallRegularFont,
  },
  editButtonTextDisabledStyle: {
    color: Colors.altLightGreyColor,
    ...FontStyles.smallRegularFont,
  },
  modalScreenHeaderRightTextStyle: {
    color: Colors.brightBlue,
    ...FontStyles.mediumRegularFont,
  },
  modalScreenHeaderRightDisabledTextStyle: {
    color: "white",
    ...FontStyles.mediumRegularFont,
  },
  addOrEditNoteDateTextStyle: {
    color: Colors.blackish,
    ...FontStyles.smallRegularFont,
  },
  addOrEditNoteTimeTextStyle: {
    color: Colors.blackish,
    ...FontStyles.smallBoldFont,
  },
  hashtagButtonTextStyle: {
    color: Colors.blackish,
    textAlign: "center",
    padding: 4,
    ...FontStyles.mediumRegularFont,
  },
  graphYAxisLabelStyle: {
    color: "#58595b",
    ...FontStyles.smallRegularFont,
  },
  graphNoDataLabelStyle: {
    color: Colors.mediumLightGrey,
    ...FontStyles.smallRegularFont,
  },
  graphHowToUploadLabelStyle: {
    color: Colors.brightBlue,
    ...FontStyles.smallRegularFont,
  },
  graphBackgroundColor: "#f6f6f6",
  graphXAxisBackgroundColor: "#ffffff",
  graphLineStrokeColor: "#e2e4e7",
  graphBgLowColor: Colors.peach,
  graphBgNormalColor: Colors.green,
  graphBgHighColor: Colors.purple,
  graphSmbgLabelStyle: {
    ...FontStyles.smallRegularFont,
  },
  graphBasalRectColor: "#c5e5f1#",
  graphBasalLineColor: "#7aceef",
  toolTipContentTextStyle: {
    color: Colors.blackish,
    ...FontStyles.mediumSmallSemiboldFont,
  },
  toolTipContentButtonTextStyle: {
    color: Colors.white,
    ...FontStyles.mediumSmallSemiboldFont,
  },
};

export default PrimaryTheme;
