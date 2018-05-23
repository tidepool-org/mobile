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

  const suffix = fontWeights[fontWeightName] ? `-${fontWeightName}` : "";
  const fontFamily = `${fontFamilyBaseName}${suffix}`;
  return {
    fontFamily,
    fontSize,
  };
}

export default makeFontStyle;
