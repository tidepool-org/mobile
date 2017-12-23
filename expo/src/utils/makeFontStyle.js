import { Platform } from "react-native";

import runTimeEnvironment from "../utils/runtimeEnvironment";

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

  // TODO: build - use some sort of conditional #ifdef preprocessing as a build step instead of runTimeEnvironment? (Also consider same for the "pre" scripts in package.json which copy files into place for the various build types (expo, storybook, ejected))
  if (runTimeEnvironment.useExpo || Platform.OS === "android") {
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
