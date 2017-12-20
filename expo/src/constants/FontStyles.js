import makeFontStyle from "../utils/makeFontStyle";

const FontStyles = {
  verySmallRegularFont: {
    ...makeFontStyle({
      fontFamilyBaseName: "OpenSans",
      fontWeightName: "Regular",
      fontSize: 10,
    }),
  },
  verySmallSemiboldFont: {
    ...makeFontStyle({
      fontFamilyBaseName: "OpenSans",
      fontWeightName: "Semibold",
      fontSize: 10,
    }),
  },
  smallRegularFont: {
    ...makeFontStyle({
      fontFamilyBaseName: "OpenSans",
      fontWeightName: "Regular",
      fontSize: 12.5,
    }),
  },
  mediumSmallRegularFont: {
    ...makeFontStyle({
      fontFamilyBaseName: "OpenSans",
      fontWeightName: "Regular",
      fontSize: 15,
    }),
  },
  mediumSmallBoldFont: {
    ...makeFontStyle({
      fontFamilyBaseName: "OpenSans",
      fontWeightName: "Bold",
      fontSize: 15,
    }),
  },
  mediumSmallSemiboldFont: {
    ...makeFontStyle({
      fontFamilyBaseName: "OpenSans",
      fontWeightName: "Semibold",
      fontSize: 15,
    }),
  },
  mediumRegularFont: {
    ...makeFontStyle({
      fontFamilyBaseName: "OpenSans",
      fontWeightName: "Regular",
      fontSize: 17,
    }),
  },
  mediumSemiboldFont: {
    ...makeFontStyle({
      fontFamilyBaseName: "OpenSans",
      fontWeightName: "Semibold",
      fontSize: 17,
    }),
  },
  mediumBoldFont: {
    ...makeFontStyle({
      fontFamilyBaseName: "OpenSans",
      fontWeightName: "Bold",
      fontSize: 17,
    }),
  },
  largeRegularFont: {
    ...makeFontStyle({
      fontFamilyBaseName: "OpenSans",
      fontWeightName: "Regular",
      fontSize: 19,
    }),
  },
  navTitleFont: {
    ...makeFontStyle({
      fontFamilyBaseName: "OpenSans",
      fontWeightName: "Regular",
      fontSize: 17.5,
    }),
  },
};

export default FontStyles;
