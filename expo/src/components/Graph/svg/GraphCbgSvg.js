import React from "react";
import { MAX_BG_VALUE } from "../helpers";
import { Circle, Symbol, Use } from "../../../svg-exports";

class GraphCbgSvg {
  static render({
    theme,
    cbgData,
    yAxisHeightInPixels,
    yAxisPixelsPerValue,
    headerHeight,
    graphStartTimeSeconds,
    pixelsPerSecond,
  }) {
    // console.log(`render`);
    const result = [];

    result.push(
      <Symbol
        key={result.length + 1}
        id="normal"
        viewBox="0 0 7 7"
        width="7"
        height="7"
      >
        <Circle r="3.5" fill={theme.graphBgNormalColor} stroke="none" />
      </Symbol>
    );
    result.push(
      <Symbol
        key={result.length + 1}
        id="low"
        viewBox="0 0 7 7"
        width="7"
        height="7"
      >
        <Circle r="3.5" fill={theme.graphBgLowColor} stroke="none" />
      </Symbol>
    );
    result.push(
      <Symbol
        key={result.length + 1}
        id="high"
        viewBox="0 0 7 7"
        width="7"
        height="7"
      >
        <Circle r="3.5" fill={theme.graphBgHighColor} stroke="none" />
      </Symbol>
    );

    for (let i = 0; i < cbgData.length; i += 1) {
      const { time, value, isLow, isHigh } = cbgData[i];
      let symbol = "#normal";
      if (isLow) {
        symbol = "#low";
      } else if (isHigh) {
        symbol = "#high";
      }
      const constrainedValue = Math.min(value, MAX_BG_VALUE);
      const deltaTime = time - graphStartTimeSeconds;
      const x = deltaTime * pixelsPerSecond;
      const y =
        headerHeight +
        Math.round(
          yAxisHeightInPixels - constrainedValue * yAxisPixelsPerValue
        );

      result.push(
        <Use
          key={result.length + 1}
          href={symbol}
          x={x}
          y={y}
          width="7"
          height="7"
        />
      );
    }

    return result;
  }
}

export default GraphCbgSvg;
