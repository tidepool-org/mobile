import { Platform } from "react-native";

import environment from "../utils/environment";

const fonts = {
  OpenSans: {
    fontWeights: {
      Light: "300",
      Regular: "400",
      Semibold: "600",
      Bold: "700",
    },
  },
};

function makeFontStyle({ fontFamilyBaseName, fontWeightName, fontSize }) {
  const { fontWeights } = fonts[fontFamilyBaseName];

  // TODO: use preprocessing?
  if (environment.useExpo || Platform.OS === "android") {
    const suffix = fontWeights[fontWeightName] ? `-${fontWeightName}` : "";
    const fontFamily = `${fontFamilyBaseName}${suffix}`;

    return {
      fontFamily,
      fontSize,
    };
  }

  const fontFamily = fontFamilyBaseName;
  const fontWeight = fontWeights[fontWeightName] || fontWeights.Regular;

  return {
    fontFamily,
    fontWeight,
    fontSize,
  };
}

export default makeFontStyle;
